import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController, MenuController, ModalController, LoadingController} from '@ionic/angular';
import {StorageModalComponent} from 'src/app/components/modal/storage-modal.component';
import {StorageModifyModalComponent} from 'src/app/components/storage-modify-modal/storage-modify-modal/storage-modify-modal.component';
import {ClientModel} from 'src/app/models/client.model';
import {Order} from 'src/app/models/order.model';
import {TagModel} from 'src/app/models/tag.model';
import {ClientService} from 'src/app/services/client.service';
import {IonToastService} from 'src/app/services/ion-toast.service';
import {NoteService} from 'src/app/services/note.service';
import {OrdersService} from 'src/app/services/orders.service';
import {StorageOrderUpdateService} from 'src/app/services/storage-order-update.service';
import {TagService} from 'src/app/services/tag.service';
import {UnsubscribeAll} from '../../../utils/unsubscribeAll';
import {filterOrder} from '../../../utils/order-utils';
import {SharedFilters} from '../../components/filter/filter.component';

@Component({
  selector: 'app-completed-list',
  templateUrl: './completed-list.page.html',
  styleUrls: ['./completed-list.page.scss'],
})
export class CompletedListPage extends UnsubscribeAll implements OnInit {

  public clients: (ClientModel & { fullname?: string })[] = [];
  public client: ClientModel;
  public orders: Order[] = [];
  private get filters(): any {
    return [
      {
        _or: [
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'client.name_contains': this.term
          },
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'client.surname_contains': this.term
          },
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            clientIndications_contains: this.term
          },
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'typesOfMaterial.name_contains': this.term
          },
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'typesOfProcessing.name_contains': this.term
          }
        ]
      },
      this.fullFilters
    ];
  }

  fullFilters: SharedFilters =  {
    isArchived: false,
    isPreventive: false,
    isCompleted: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    tags_contains: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    deliveryDate_gte: undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    deliveryDate_lte: undefined
  };
  public tags: TagModel[] = [];
  public inCompletedPage = true;
  public term: string;
  public loader: HTMLIonLoadingElement;

  constructor(private clientService: ClientService,
              private orderService: OrdersService,
              private ionToastService: IonToastService,
              private ordersService: OrdersService,
              private alertCtrl: AlertController,
              private tagsService: TagService,
              private modalCtrl: ModalController,
              private router: Router,
              public notesService: NoteService,
              public menu: MenuController,
              public storageModifyService: StorageOrderUpdateService,
              private loadingController: LoadingController) {
    super();
  }


  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.tagsService.getTags().subscribe(
      tags => {
        this.tags = tags;
      }
    );
    // this.clients = [...(await this.clientService.find()).map((c: any) => {
    //   c.fullname = c.name + ' ' + c.surname;
    //   return c;
    // })];
    const getClient = this.clientService.getClients().subscribe(
      clients => this.clients = clients
    );

    this.subscriptions.add(getClient);

    await this.present();
    this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC').then((orders) => {
      this.orders = orders;
      this.loader.dismiss();
    });
  }

  async present() {
    this.loader = await this.loadingController.create({
      message: 'Loading...'
    });
    this.loader.present().then();
  }

  async error() {
    const loader = await this.loadingController.create({
      message: `C'è stato un errore nel caricamento dei dati, riprova`
    });
    loader.present().then();
  }

  async getNextPage() {
    await this.present();
    const orders = await this.orderService.find(this.filters, this.term, this.orders.length);
    this.orders.push(...orders.filter(f => !this.orders.find(old => old.id === f.id)));
    this.loader.dismiss();
  }

  async onFilterChange(filter) {
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

  async cleanClient(event) {
    if (event == 'clean') {
      delete this.filters.client;
      this.client = null;
      this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
    } else {
      this.filters.client = event.value.id;
      this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
    }
  }

  async searchByClient(event) {
    this.term = event.text;

    const clients = (await this.clientService.find(null, this.term, 0, 20, 'surname:ASC')).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    });
    this.clients = [...clients];

  }

  async getMoreClients(event) {

    const clients = (await this.clientService.find(null, this.term, this.clients.length, 20, 'surname:ASC')).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    });
    this.clients.push(...clients);

    event.component.endInfiniteScroll();

    if (!clients.length) {
      event.component.disableInfiniteScroll();
    }
  }

  async search() {
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  };


  async updateList() {
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

  async openModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: StorageModalComponent,
      componentProps: {order, storageForNote: true}
    });
    await modal.present();
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

  select(event, order) {
    switch (event.detail.value) {
      case 'goToChangeOrder':
        this.router.navigate([`/dashboard/order-complete/${order.id}`]);
        break;
      case 'deleteOrder':
        this.deleteOrder(order.id);
        break;
      case 'storeOrder':
        this.storeOrder(order);
        break;
      case 'removeCompletion':
        this.removeCompletion(order);
        break;
      case 'changeInPreventive':
        this.changeInPreventive(order);
        break;
    }
  }

  async removeCompletion(order: Order) {
    this.alertCtrl.create({
      header: 'Rimuovi Completamento dall\'Ordine',
      subHeader: '',
      message: 'Sei sicuro di voler rimuovere il completamento dell\'ordine ?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isCompleted = false;
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async storeOrder(order: Order) {
    this.alertCtrl.create({
      header: 'Archivia Ordine',
      subHeader: '',
      message: 'Sei sicuro di voler archiviare l\'ordine ?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isArchived = true;
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  seePreview(order) {
    this.router.navigate([`/dashboard/preview/${order.id}`]);
  }

  async changeInPreventive(order) {
    this.alertCtrl.create({
      header: 'Sposta Ordine in Preventivi',
      subHeader: '',
      message: 'Sei sicuro di voler spostare l\'ordine nella lista preventivi ?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isPreventive = true;
            order.isCompleted = false;
            await this.orderService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  compareWith(currentValue: any, compareValue: any) {
    if (Array.isArray(compareValue)) {
      return (compareValue || []).map(cv => cv.id).indexOf(currentValue.id) > -1;
    }
    return compareValue.id == currentValue.id;
  }

  async deleteOrder(index) {
    this.alertCtrl.create({
      header: 'Elimina Ordine',
      subHeader: '',
      message: 'Sei sicuro di voler eliminare l\'ordine ?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.orderService.deleteOrder(index);
            this.ionToastService.alertMessage('delete');
            this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async restoreOrder(order: Order) {
    this.alertCtrl.create({
      header: 'Ripristina Ordine',
      subHeader: '',
      message: 'Sei sicuro di voler ripristinare l\'ordine ?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isArchived = false;
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async updateTags(order) {
    await this.orderService.updateOrder(order, order.id, order.client);
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

  async seeStorageModify(order) {
    const modal = await this.modalCtrl.create({
      component: StorageModifyModalComponent,
      componentProps: {order}
    });
    await modal.present();
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

}
