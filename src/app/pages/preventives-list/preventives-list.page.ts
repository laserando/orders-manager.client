import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { ClientModel } from 'src/app/models/client.model';
import { LogModel } from 'src/app/models/log.model';
import { Order } from 'src/app/models/order.model';
import { Role } from 'src/app/models/role.model';
import { TagModel } from 'src/app/models/tag.model';
import { ClientService } from 'src/app/services/client.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { NoteService } from 'src/app/services/note.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RolesService } from 'src/app/services/roles.service';
import { TagService } from 'src/app/services/tag.service';
import { UnsubscribeAll } from "../../../utils/unsubscribeAll";

@Component({
  selector: 'app-preventives-list',
  templateUrl: './preventives-list.page.html',
  styleUrls: ['./preventives-list.page.scss'],
})
export class PreventivesListPage extends UnsubscribeAll implements OnInit {

  public preventives: Order[] = [];
  public role: string;
  public term: string;
  public filter: any = { isArchived: false, isPreventive: true, isCompleted: false };
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
    private ordersService: OrdersService,
    private rolesService: RolesService,
    private tagsService: TagService,
    private clientService: ClientService,
    private router: Router,
    public notesService: NoteService,
    public menu: MenuController,
    private alertCtrl: AlertController
  ) {
    super();
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {

    const getClients = this.clientService.getClients().subscribe(
      clients => {
        this.clients = clients;
      }
    )
    const getTags = this.tagsService.getTags().subscribe(
      f => this.tags = f
    );
    const getRoles = this.rolesService.getRoles().subscribe(
      roles => this.roles = roles
    );

    this.addSubscriptions(getClients, getTags, getRoles);

    this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async deleteOrder(index) {
    this.alertCtrl.create({
      header: 'Elimina Preventivo',
      subHeader: '',
      message: "Sei sicuro di voler eliminare il preventivo ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.orderService.deleteOrder(index);
            this.ionToastService.alertMessage("delete");
            this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
    this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async search() {

    this.preventives = await this.orderService.find(this.filter, null, 0, 20);


    const checked = this.preventives.filter(order => order.client.surname.toLowerCase().includes(this.term) || order.client.name.toLowerCase().includes(this.term) || order.typesOfProcessing.name.toLowerCase().includes(this.term));

    if (checked.length === 0) {
      this.preventives = await this.orderService.find(this.filter, null, 0, 20);
    } else {
      this.preventives = [...checked];
    }
  };


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
        this.router.navigate([`/dashboard/preventive/${order.id}`]);
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
    this.alertCtrl.create({
      header: 'Sposta Preventivo in Ordini',
      subHeader: '',
      message: "Sei sicuro di voler spostare il preventivo nella lista degli ordini ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isPreventive = false;
            await this.orderService.updateOrder(order, order.id, order.client);
            this.preventives = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.preventives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
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
