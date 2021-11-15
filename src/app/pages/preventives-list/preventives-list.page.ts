import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { ClientModel } from 'src/app/models/client.model';
import { LogModel } from 'src/app/models/log.model';
import { Order } from 'src/app/models/order.model';
import { Role } from 'src/app/models/role.model';
import { TagModel } from 'src/app/models/tag.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { NoteService } from 'src/app/services/note.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RolesService } from 'src/app/services/roles.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-preventives-list',
  templateUrl: './preventives-list.page.html',
  styleUrls: ['./preventives-list.page.scss'],
})
export class PreventivesListPage implements OnInit {

  public preventives: Order[] = [];
  public role: string;
  public term: string;
  public filter: any = { isPreventive: true };
  public logs: LogModel[] = [];
  public roles: Role[] = [];
  public tags: TagModel[] = [];
  public to: string;
  public from: string;
  public clients: (ClientModel & { fullname?: string })[] = [];
  public client: ClientModel;
  public inPreventivePage: boolean = true;

  constructor(
    private orderService: OrdersService,
    private ionToastService: IonToastService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private rolesService: RolesService,
    private tagsService: TagService,
    private modalCtrl: ModalController,
    private clientService: ClientService,
    private router: Router,
    public notesService: NoteService,
    public menu: MenuController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.clients = [...(await this.clientService.find()).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })];
    this.tags = await this.tagsService.find()
    this.roles = await this.rolesService.find()
    this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async deleteOrder(index) {
    if (confirm("sei sicuro di voler eliminare l'ordine?")) {
      await this.orderService.deleteOrder(index);
      this.ionToastService.alertMessage("delete");
    }
    this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async search() {
    this.preventives = await this.orderService.find(this.filter, this.term, 0, 20);
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
      this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    } else {
      this.filter.client = event.value.id;
      this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    }
  }

  async getNextPage() {
    const orders = await this.orderService.find(this.filter, this.term, this.preventives.length);
    this.preventives.push(...orders);
  }

  async updateList() {
    this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  select(event, order) {
    switch (event.detail.value) {
      case "seeTags":
        this.router.navigate([`/dashboard/orders_/${order.id}`]);
        break;
      case "goToChangePreventive":
        this.router.navigate([`/dashboard/orders/${order.id}`]);
        break;
      case "deletePreventive":
        this.deleteOrder(order.id);
        break;
      case "changeInOrder":
        this.changeInOrder(order)
        break;
    }
  }

  async changeInOrder(order) {
    if (confirm("Sei sicuro di voler spostare l'ordine nella lista preventivi?")) {
      order.isPreventive = false;
      await this.orderService.updateOrder(order, order.id, order.client);
      this.preventives = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
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
    this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async onFilterChange(filter) {
    if (filter.tags && filter.tags.length) {
      this.filter.tags_contains = filter.tags;
    } else {
      delete this.filter.tags_contains;
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
    this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  seePreview(order) {
    this.router.navigate([`/dashboard/preview/${order.id}`]);
  }

}
