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
import { AlertController, LoadingController, MenuController, ModalController } from '@ionic/angular';
import { StorageModalComponent } from "src/app/components/modal/storage-modal.component";
import { ClientService } from 'src/app/services/client.service';
import { ClientModel } from 'src/app/models/client.model';
import { Router } from '@angular/router';
import { NoteService } from 'src/app/services/note.service';
import { StorageModifyModalComponent } from 'src/app/components/storage-modify-modal/storage-modify-modal/storage-modify-modal.component';
import { StorageOrderUpdateService } from 'src/app/services/storage-order-update.service';
import { UnsubscribeAll } from "../../../utils/unsubscribeAll";
import { filterOrder } from "../../../utils/order-utils";
import * as XLSX from "xlsx";
import { DateTime } from "luxon";
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage extends UnsubscribeAll implements OnInit {

  public user: any;
  public orders: Order[] = [];
  public role: string;
  public term: string;
  public filter: any = { isArchived: false, isPreventive: false, isCompleted: false };
  public logs: LogModel[] = [];
  public roles: Role[] = [];
  public tags: TagModel[] = [];
  public to: string;
  public from: string;
  public clients: (ClientModel & { fullname?: string; })[] = [];
  public client: ClientModel;
  public loader: HTMLIonLoadingElement;

  xlsxFilter: any = {};

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

  ngOnInit() {

    this.role = this.authService.getParseOfUserObject();
    if (this.authService.getUser().role.id != 1) {
      this.filter.role = this.authService.getUser().role.id;
    }
    ;

  }

  async ionViewWillEnter() {

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
    this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC').then((orders) => {
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

  async deleteOrder(index) {
    this.alertCtrl.create({
      header: 'Elimina Ordine',
      subHeader: '',
      message: "Sei sicuro di volere eliminare l'ordine ?",
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
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());

  }

  async search() {
    await this.present();
    this.orders = await filterOrder.bind(this)();
    this.loader.dismiss().then();
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

  async cleanClient(event) {
    this.present();
    if (event == 'clean') {
      delete this.filter.client;
      this.client = null;
      this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    } else {
      this.filter.client = event.value.id;
      this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    }
    this.loader.dismiss();
  }

  async getNextPage() {
    await this.present();
    const orders = await this.orderService.find(this.filter, this.term, this.orders.length, 20, 'deliveryDate:ASC');
    this.orders.push(...orders.filter(f => !this.orders.find(old => old.id === f.id)));
    this.loader.dismiss();
  }

  async completeOrder(order: Order) {
    this.alertCtrl.create({
      header: 'Completa Ordine',
      subHeader: '',
      message: "Sei sicuro di voler completare l'ordine?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isCompleted = true;
            order.role.id = 1;
            order.role.name = "amministrazione";
            await this.ordersService.updateOrder(order, order.id, order.client);
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  async removeCompletion(order: Order) {
    this.alertCtrl.create({
      header: 'Rimuovi Completamento',
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
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
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
        { type: 'text', name: 'graphicLink', placeholder: 'scrivi link grafica...' }
      ],
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            if (res.graphicLink) {
              client.graphicLink = res.graphicLink;
              await this.clientService.updateCustomer(client);
            }
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

  async changeState(order: Order) {
    this.alertCtrl.create({
      header: 'Cambio Assegnazione',
      subHeader: '',
      message: "Sei sicuro di voler cambiare l'assegnazione ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.orderService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
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
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
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
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        }
      ]
    }).then(res => res.present());
  }

  private mapFilter(filter) {
    const _filter: any = {};
    if (filter.tags && filter.tags.length) {
      _filter.tags_contains = filter.tags;
    } else {
      delete _filter.tags_contains;
    }
    if (filter.roles && filter.roles.length) {
      _filter.role_in = filter.roles;
    } else {
      delete _filter.role_in;
    }
    if (filter.deliveryDate?.from) {
      _filter.deliveryDate_gte = filter.deliveryDate.from;
    } else {
      delete _filter.deliveryDate_gte;
    }
    if (filter.deliveryDate?.to) {
      _filter.deliveryDate_lte = filter.deliveryDate.to;
    } else {
      delete _filter.deliveryDate_lte;
    }
    if (filter.isArchived && filter.isArchived.length) {
      if (filter.isArchived.find(ia => ia == 'isArchived') && filter.isArchived.find(ia => ia == 'notArchived')) {
        delete _filter.isArchived;
      } else {
        if (filter.isArchived.find(ia => ia == 'isArchived')) {
          _filter.isArchived = true;
        }
        if (filter.isArchived.find(ia => ia == 'notArchived')) {
          _filter.isArchived = false;
        }
      }
    } else {
      _filter.isArchived = false;
    }
    if (filter.isArchived) {
      if (filter.isArchived.find(ia => ia == 'complete')) {
        _filter.isCompleted = true;
      } else {
        delete _filter.isCompleted;
      }
    }
    return _filter;
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
        delete this.filter.isCompleted;
      }
    }
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async openModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: StorageModalComponent,
      componentProps: { order: order, storageForNote: true }
    });
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
      message: "Sei sicuro di voler spostare l'ordine nella lista preventivi ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            order.isPreventive = true;
            await this.orderService.updateOrder(order, order.id, order.client);
            this.orders = await this.ordersService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
          }
        },
        {
          text: 'Annulla', handler: async (res) => {
            this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
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
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async seeStorageModify(order) {
    const modal = await this.modalCtrl.create({
      component: StorageModifyModalComponent,
      componentProps: { order: order }
    });
    await modal.present();
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

  async downloadXLSX() {
    const loader = await this.loadingController.create({ message: "Downloading..." });
    loader.present();
    try {
      const orders = [];
      let nextPage = true;
      const paging = 500;
      while (nextPage) {
        const result = await this.orderService.find(this.mapFilter(this.xlsxFilter), undefined, orders.length, paging, 'deliveryDate:ASC');
        if ((result.length === 0 || result.length < paging)) {
          nextPage = false;
        }
        orders.push(...result);
      }

      const table = document.createElement('table');
      const header = document.createElement('thead');
      header.innerHTML = `<tr>
      <th>N°</th>
      <th>Nome</th>
      <th>Cognome</th>
      <th>Tipologia lavorazione</th>
      <th>Tipologia materiale</th>
      <th>Dimensioni articolo</th>
      <th>Grafica presente</th>
      <th>Data consegna</th>
      <th>Assegnato a</th>
      <th>#TAG stato ordine</th>
    </tr>`;
      table.append(header);
      const body = document.createElement('tbody');
      for (let order of orders) {
        const row = `<tr>
      <td id="number">${order.id}</td>
      <td>${order.client?.name}</td>
      <td>${order.client?.surname}</td>
      <td>${order.typesOfProcessing?.name}</td>
      <td>${order.typesOfMaterial?.name}</td>
      <td>${order.itemSize}</td>
      <td>${order.client?.graphicLink || 'NO'}</td>
      <td>${order.deliveryDate}</td>
      <td>${order.role.name}</td>
      <td>${order.tags?.map(t => t.name).join(', ')}</td>
    </tr>`;

        body.innerHTML += row;
      }
      table.append(body);
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // const mediaType = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
      const userInp = XLSX.writeFileXLSX(wb, 'lista-ordini.xlsx');
      const a = document.createElement('a');
      a.href = userInp;
      a.download = 'lista-ordini.xlsx';
      a.click();
      loader.dismiss();
    } catch (err) {
      console.error(err);
      loader.dismiss();
    }
  }

}
