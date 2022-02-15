import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { StorageModalComponent } from 'src/app/components/modal/storage-modal.component';
import { ClientModel } from 'src/app/models/client.model';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { NoteService } from 'src/app/services/note.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RolesService } from 'src/app/services/roles.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-archived-list',
  templateUrl: './archived-list.page.html',
  styleUrls: ['./archived-list.page.scss'],
})
export class ArchivedListPage implements OnInit {

  public clients: (ClientModel & { fullname?: string })[] = [];
  public client: ClientModel;
  public archives: Order[] = [];
  public filter: any = { isArchived: true };
  public inArchivedPage: boolean = true;
  public term: string;

  constructor(private clientService: ClientService,
    private orderService: OrdersService,
    private ionToastService: IonToastService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private rolesService: RolesService,
    private tagsService: TagService,
    private modalCtrl: ModalController,
    private router: Router,
    public notesService: NoteService,
    public menu: MenuController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.clients = [...(await this.clientService.find()).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })];
    this.archives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async getNextPage() {
    const orders = await this.orderService.find(this.filter, this.term, this.archives.length);
    this.archives.push(...orders);
  }

  async onFilterChange(filter) {
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

    this.archives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async cleanClient(event) {
    if (event == 'clean') {
      delete this.filter.client;
      this.client = null;
      this.archives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    } else {
      this.filter.client = event.value.id;
      this.archives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
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
    this.archives = await this.orderService.find(this.filter, this.term, 0, 20);
  }

  async updateList() {
    this.archives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async openModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: StorageModalComponent,
      componentProps: { order: order, storageForNote: true }
    })
    await modal.present();
    this.archives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  select(event, order) {
    switch (event.detail.value) {
      case "deleteOrder":
        this.deleteOrder(order.id);
        break;
      case "restoreOrder":
        this.restoreOrder(order);
        break;
    }
  }

  seePreview(order) {
    this.router.navigate([`/dashboard/preview/${order.id}`]);
  }

  async changeInPreventive(order) {
    if (confirm("Sei sicuro di voler spostare l'ordine nella lista preventivi?")) {
      order.isPreventive = true;
      await this.orderService.updateOrder(order, order.id, order.client);
      this.archives = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    }
  }

  compareWith(currentValue: any, compareValue: any) {
    if (Array.isArray(compareValue)) {
      return (compareValue || []).map(cv => cv.id).indexOf(currentValue.id) > -1;
    }
    return compareValue.id == currentValue.id;
  }

  async deleteOrder(index) {
    if (confirm("sei sicuro di voler eliminare l'ordine?")) {
      await this.orderService.deleteOrder(index);
      this.ionToastService.alertMessage("delete");
    }
    this.archives = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async restoreOrder(order: Order) {
    if (confirm("SEI SICURO DI VOLER RIPRISTINARE L'ORDINE?")) {
      order.isArchived = false;
      await this.ordersService.updateOrder(order, order.id, order.client);
    }
    this.archives = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC')
  }

}
