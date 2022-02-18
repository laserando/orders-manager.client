import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { LogModel } from 'src/app/models/log.model';
import { Role } from 'src/app/models/role.model';
import { RolesService } from 'src/app/services/roles.service';
import { TagService } from 'src/app/services/tag.service';
import { TagModel } from 'src/app/models/tag.model';
import { MenuController, ModalController } from '@ionic/angular';
import { StorageModalComponent } from "src/app/components/modal/storage-modal.component";
import { ClientService } from 'src/app/services/client.service';
import { ClientModel } from 'src/app/models/client.model';
import { Router } from '@angular/router';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit {

  public orders: Order[] = [];
  public role: string;
  public term: string;
  public filter: any;
  public logs: LogModel[] = [];
  public roles: Role[] = [];
  public tags: TagModel[] = [];
  public to: string;
  public from: string;
  public clients: (ClientModel & { fullname?: string })[] = [];
  public client: ClientModel;

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
    public menu: MenuController) { }

  async ngOnInit() {
    this.role = this.authService.getParseOfUserObject();
    if (this.authService.getUser().role.id == 1) {
      this.filter = { isArchived: false, isPreventive: false };
    } else if (this.authService.getUser().role.id != 1) {
      this.filter = { role: this.authService.getUser().role.id, isArchived: false,isPreventive: false };
    }
  }

  async ionViewWillEnter() {
    this.clients = [...(await this.clientService.find()).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })];
    this.tags = await this.tagsService.find()
    this.roles = await this.rolesService.find()
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async deleteOrder(index) {
    if (confirm("sei sicuro di voler eliminare l'ordine?")) {
      await this.orderService.deleteOrder(index);
      this.ionToastService.alertMessage("delete");
    }
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async search() {
    this.orders = await this.orderService.find(this.filter, this.term, 0, 20);
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

  async getNextPage() {
    const orders = await this.orderService.find(this.filter, this.term, this.orders.length);
    this.orders.push(...orders);
  }

  async completeOrder(order: Order) {
    if (confirm("sei sicuro di voler completare l'ordine?")) {
      order.isCompleted = true;
      order.role.id = 1;
      order.role.name = "amministrazione";
      await this.ordersService.updateOrder(order, order.id, order.client);
      this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
    }
  }

  async removeCompletion(order: Order) {
    if (confirm("sei sicuro di voler TOGLIERE il COMPLETAMENTO dell'ordine?")) {
      order.isCompleted = false;
      await this.ordersService.updateOrder(order, order.id, order.client);
      this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
    }
  }

  async addGraphic(client: ClientModel) {
    if (confirm("VUOI CAMBIARE IL LINK DELLA GRAFICA ?")) {
      client.graphicLink = prompt("inserisci link grafica");
      if (client.graphicLink) {
        await this.clientService.updateCustomer(client);
      }
    }
    this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
  }

  async changeState(order: Order) {
    if (confirm("SEI SICURO DI VOLER CAMBIARE L'ASSEGNAZIONE?")) {
      await this.orderService.updateOrder(order, order.id, order.client);
    }
    this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async storeOrder(order: Order) {
    if (confirm("SEI SICURO DI VOLER ARCHIVIARE L'ORDINE?")) {
      order.isArchived = true;
      await this.ordersService.updateOrder(order, order.id, order.client);
    }
    this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
  }

  async restoreOrder(order: Order) {
    if (confirm("SEI SICURO DI VOLER RIPRISTINARE L'ORDINE?")) {
      order.isArchived = false;
      await this.ordersService.updateOrder(order, order.id, order.client);
    }
    this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
  }

  async onFilterChange(filter) {
    if (filter.tags && filter.tags.length) {
      console.log(filter.tags)
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

  async openModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: StorageModalComponent,
      componentProps: { order: order, storageForNote: true }
    })
    await modal.present();
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async updateList() {
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  select(event, order) {
    switch (event.detail.value) {
      case "seeTags":
        this.router.navigate([`/dashboard/orders_/${order.id}`]);
        break;
      case "goToChangeOrder":
        this.router.navigate([`/dashboard/orders/${order.id}`]);
        break;
      case "deleteOrder":
        this.deleteOrder(order.id);
        break;
      case "completeOrder":
        this.completeOrder(order);
        break;
      case "storeOrder":
        this.storeOrder(order);
        break;
      case "restoreOrder":
        this.restoreOrder(order);
        break;
      case "removeCompletion":
        this.removeCompletion(order);
        break;
      case "changeInPreventive":
        this.changeInPreventive(order)
        break;
    }
  }

  seePreview(order){
    this.router.navigate([`/dashboard/preview/${order.id}`]);
  }

  async changeInPreventive(order) {
    if (confirm("Sei sicuro di voler spostare l'ordine nella lista preventivi?")) {
      order.isPreventive = true;
      await this.orderService.updateOrder(order, order.id, order.client);
      this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    }
  }

  compareWith(currentValue: any, compareValue: any) {
    if (Array.isArray(compareValue)) {
      return (compareValue || []).map(cv => cv.id).indexOf(currentValue.id) > -1;
    }
    return compareValue.id == currentValue.id;
  }

  async updateTags(order) {
    await this.orderService.updateOrder(order, order.id, order.client);
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

}