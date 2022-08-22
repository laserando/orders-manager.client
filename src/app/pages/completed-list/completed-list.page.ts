import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { StorageModalComponent } from 'src/app/components/modal/storage-modal.component';
import { StorageModifyModalComponent } from 'src/app/components/storage-modify-modal/storage-modify-modal/storage-modify-modal.component';
import { ClientModel } from 'src/app/models/client.model';
import { Order } from 'src/app/models/order.model';
import { TagModel } from 'src/app/models/tag.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { NoteService } from 'src/app/services/note.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RolesService } from 'src/app/services/roles.service';
import { StorageOrderUpdateService } from 'src/app/services/storage-order-update.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-completed-list',
  templateUrl: './completed-list.page.html',
  styleUrls: ['./completed-list.page.scss'],
})
export class CompletedListPage implements OnInit {

  public clients: (ClientModel & { fullname?: string })[] = [];
  public client: ClientModel;
  public orders: Order[] = [];
  public filter: any = { isCompleted: true, isArchived: false };
  public tags: TagModel[] = [];
  public inCompletedPage: boolean = true;
  public term: string;

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
    public storageModifyService: StorageOrderUpdateService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {

    this.tags = await this.tagsService.find();
    this.clients = [...(await this.clientService.find()).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })];
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async getNextPage() {
    const orders = await this.orderService.find(this.filter, this.term, this.orders.length);
    this.orders.push(...orders);
  }

  async onFilterChange(filter) {
    if (filter.tags && filter.tags.length) {
      this.filter.tags_contains = filter.tags;
    } else {
      delete this.filter.tags_contains;
    }
    if (filter.roles && filter.roles.length) {
      this.filter.role_in = filter.roles;
    } else {
      delete this.filter.role_in;
    }
    if (filter.deliveryDate.from) {
      this.filter.deliveryDate_gte = filter.deliveryDate.from;
    } else {
      delete this.filter.deliveryDate_gte;
    }
    if (filter.deliveryDate.to) {
      this.filter.deliveryDate_lte = filter.deliveryDate.to;
    } else {
      delete this.filter.deliveryDate_lte;
    }
    if (filter.isArchived && filter.isArchived.length) {
      if (filter.isArchived.find(ia => ia == 'isArchived') && filter.isArchived.find(ia => ia == 'notArchived')) {
        delete this.filter.isArchived;
      } else {
        if (filter.isArchived.find(ia => ia == 'isArchived')) {
          this.filter.isArchived = true;
        }
        if (filter.isArchived.find(ia => ia == 'notArchived')) {
          this.filter.isArchived = false;
        }
      }
    } else {
      this.filter.isArchived = false;
    }
    if (filter.isArchived) {
      if (filter.isArchived.find(ia => ia == 'complete')) {
        this.filter.isCompleted = true;
      } else {
        delete this.filter.isCompleted
      }
    }
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async cleanClient(event) {
    if (event == 'clean') {
      delete this.filter.client;
      this.client = null;
      this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    } else {
      this.filter.client = event.value.id;
      this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    }
  }

  async searchByClient(event) {
    this.term = event.text

    const clients = (await this.clientService.find(null, this.term, 0, 20, 'surname:ASC')).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.clients = [...clients]

  }

  async getMoreClients(event) {

    const clients = (await this.clientService.find(null, this.term, this.clients.length, 20, 'surname:ASC')).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.clients.push(...clients);

    event.component.endInfiniteScroll();

    if (!clients.length) {
      event.component.disableInfiniteScroll();
    }
  }

  async search() {

    this.orders = await this.orderService.find(this.filter, null, 0, 20);
    console.log(this.orders);

    const checked = this.orders.filter(order => order.client.surname.toLowerCase().includes(this.term) || order.client.name.toLowerCase().includes(this.term) || order.typesOfProcessing.name.toLowerCase().includes(this.term));

    if (checked.length === 0) {
      this.orders = await this.orderService.find(this.filter, null, 0, 20);
    } else {
      this.orders = [...checked];
    }
  };



  async updateList() {
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async openModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: StorageModalComponent,
      componentProps: { order: order, storageForNote: true }
    })
    await modal.present();
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  select(event, order) {
    switch (event.detail.value) {
      case "goToChangeOrder":
        this.router.navigate([`/dashboard/order-complete/${order.id}`]);
        break;
      case "deleteOrder":
        this.deleteOrder(order.id);
        break;
      case "storeOrder":
        this.storeOrder(order);
        break;
      case "removeCompletion":
        this.removeCompletion(order);
        break;
      case "changeInPreventive":
        this.changeInPreventive(order)
        break;
    }
  }

  async removeCompletion(order: Order) {
    this.alertCtrl.create({
      header: "Rimuovi Completamento dall'Ordine",
      subHeader: '',
      message: "Sei sicuro di voler rimuovere il completamento dell'ordine ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isCompleted = false;
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async storeOrder(order: Order) {
    this.alertCtrl.create({
      header: 'Archivia Ordine',
      subHeader: '',
      message: "Sei sicuro di voler archiviare l'ordine ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isArchived = true;
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
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
      message: "Sei sicuro di voler spostare l'ordine nella lista preventivi ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isPreventive = true;
            order.isCompleted = false;
            await this.orderService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
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
      message: "Sei sicuro di voler eliminare l'ordine ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.orderService.deleteOrder(index);
            this.ionToastService.alertMessage("delete");
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
          }
        }
      ]
    }).then(res => res.present());
  }

  async restoreOrder(order: Order) {
    this.alertCtrl.create({
      header: 'Ripristina Ordine',
      subHeader: '',
      message: "Sei sicuro di voler ripristinare l'ordine ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isArchived = false;
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async updateTags(order) {
    await this.orderService.updateOrder(order, order.id, order.client);
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async seeStorageModify(order) {
    const modal = await this.modalCtrl.create({
      component: StorageModifyModalComponent,
      componentProps: { order: order }
    })
    await modal.present();
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

}
