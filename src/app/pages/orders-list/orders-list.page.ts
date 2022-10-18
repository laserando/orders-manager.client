import {Component, OnInit} from '@angular/core';
import {Order} from 'src/app/models/order.model';
import {OrdersService} from 'src/app/services/orders.service';
import {IonToastService} from 'src/app/services/ion-toast.service';
import {AuthService} from 'src/app/services/auth.service';
import {LogModel} from 'src/app/models/log.model';
import {Role} from 'src/app/models/role.model';
import {RolesService} from 'src/app/services/roles.service';
import {TagService} from 'src/app/services/tag.service';
import {TagModel} from 'src/app/models/tag.model';
import {AlertController, LoadingController, MenuController, ModalController} from '@ionic/angular';
import {StorageModalComponent} from 'src/app/components/modal/storage-modal.component';
import {ClientService} from 'src/app/services/client.service';
import {ClientModel} from 'src/app/models/client.model';
import {Router} from '@angular/router';
import {NoteService} from 'src/app/services/note.service';
import {
  StorageModifyModalComponent
} from 'src/app/components/storage-modify-modal/storage-modify-modal/storage-modify-modal.component';
import {StorageOrderUpdateService} from 'src/app/services/storage-order-update.service';
import {UnsubscribeAll} from '../../../utils/unsubscribeAll';
import {filterOrdersFn} from '../../../utils/order-utils';
import {SharedFilters} from '../../components/filter/filter.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage extends UnsubscribeAll implements OnInit {

  public user: any;
  public orders: Order[] = [];
  public role: string;
  public term = '';

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
    isCompleted: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    tags_contains: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    deliveryDate_gte: undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    deliveryDate_lte: undefined
  };

  public logs: LogModel[] = [];
  public roles: Role[] = [];
  public tags: TagModel[] = [];
  public to: string;
  public from: string;
  public clients: (ClientModel & { fullname?: string })[] = [];
  public client: ClientModel;
  public loader: HTMLIonLoadingElement;
  constructor(private orderService: OrdersService,
              private ionToastService: IonToastService,
              private authService: AuthService,
              private ordersService: OrdersService,
              private rolesService: RolesService,
              private tagsService: TagService,
              private modalCtrl: ModalController,
              private clientService: ClientService,
              private router: Router,
              public notesService: NoteService,
              public menu: MenuController,
              public storageModifyService: StorageOrderUpdateService,
              private alertCtrl: AlertController,
              private loadingController: LoadingController) {
    super();
  }

  async ngOnInit() {


  }

  async ionViewWillEnter() {
    this.role = this.authService.getParseOfUserObject();
    if (this.authService.getUser().role.id !== 1) {
      this.filters.role = this.authService.getUser().role.id;
    }
    ;
    const getClient = this.clientService.getClients().subscribe(
      clients => this.clients = clients
    );
    const getTags = this.tagsService.getTags().subscribe(
      f => {
        this.tags = f;
      }
    );
    const getRoles = this.rolesService.getRoles().subscribe(
      f => this.roles = f
    );

    this.subscriptions.add(getClient);
    this.subscriptions.add(getTags);
    this.subscriptions.add(getRoles);

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

  async deleteOrder(orderId: number) {
    this.alertCtrl.create({
      header: 'Elimina Ordine',
      subHeader: '',
      message: 'Sei sicuro di volere eliminare l\'ordine ?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.orderService.deleteOrder(orderId);
            this.ionToastService.alertMessage('delete');
            const index = this.orders.findIndex(f => f.id === orderId);
            this.orders.splice(index, 1);
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            // this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());

  }

  async search() {
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

  async error() {
    const loader = await this.loadingController.create({
      keyboardClose: true,
      spinner: 'null' as any,
      duration: 1000,
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

  async completeOrder(order: Order) {
    this.alertCtrl.create({
      header: 'Completa Ordine',
      subHeader: '',
      message: 'Sei sicuro di voler completare l\'ordine?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isCompleted = true;
            order.role.id = 1;
            order.role.name = 'amministrazione';
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            // this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async removeCompletion(order: Order) {
    this.alertCtrl.create({
      header: 'Rimuovi Completamento',
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
            // this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async addGraphic(client: ClientModel) {
    this.alertCtrl.create({
      header: 'Modifica Link Grafica',
      subHeader: '',
      message: 'puoi scrivere qui il link della grafica',
      inputs: [
        {type: 'text', name: 'graphicLink', placeholder: 'scrivi link grafica...'}
      ],
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            if (res.graphicLink) {
              client.graphicLink = res.graphicLink;
              await this.clientService.updateCustomer(client);
            }
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            // this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async changeState(order: Order) {
    this.alertCtrl.create({
      header: 'Cambio Assegnazione',
      subHeader: '',
      message: 'Sei sicuro di voler cambiare l\'assegnazione ?',
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.orderService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
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
            this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
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
            this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async onFilterChange(inputFilters) {
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
    this.orders = this.orders.filter(f => filterOrdersFn(f, this.term));
  }

  async openModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: StorageModalComponent,
      componentProps: {order, storageForNote: true}
    });
    await modal.present();
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

  async updateList() {
    this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
  }

  select(event, order) {
    switch (event.detail.value) {
      case 'seeTags':
        this.router.navigate([`/dashboard/orders_/${order.id}`]);
        break;
      case 'goToChangeOrder':
        this.router.navigate([`/dashboard/orders/${order.id}`]);
        break;
      case 'deleteOrder':
        this.deleteOrder(order.id);
        break;
      case 'completeOrder':
        this.completeOrder(order);
        break;
      case 'storeOrder':
        this.storeOrder(order);
        break;
      case 'restoreOrder':
        this.restoreOrder(order);
        break;
      case 'removeCompletion':
        this.removeCompletion(order);
        break;
      case 'changeInPreventive':
        this.changeInPreventive(order);
        break;
    }
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
            await this.orderService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.orderService.find(this.filters, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  compareWith(currentValue: any, compareValue: any) {
    if (Array.isArray(compareValue)) {
      return (compareValue || []).map(cv => cv.id).indexOf(currentValue.id) > -1;
    }
    return compareValue.id === currentValue.id;
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
