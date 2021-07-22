import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageModalComponent } from 'src/app/components/modal/storage-modal.component';
import { LogModel } from 'src/app/models/log.model';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-timing',
  templateUrl: './order-timing.page.html',
  styleUrls: ['./order-timing.page.scss'],
})
export class OrderTimingPage implements OnInit {

  public inTimingPage: boolean = true;
  public orders: (Order & { status?: { [key: string]: number } })[] = [];
  public logs: LogModel[] = [];
  public term: string;
  public filter: any = { isArchived: false };
  public states: any[] = []

  constructor(private orderService: OrdersService,
    private modalCtrl: ModalController) { }

  async ionViewWillEnter() {
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    for (let order of this.orders) {
      const status: any = {};

      let dataCreationOrder = (new Date(order.created_at)).getTime() / 1000
      dataCreationOrder = dataCreationOrder / 3600

      for (let log of order.logs) {

        let lastDate = ((new Date(log.created_at)).getTime() / 1000);
        lastDate = (lastDate / 3600);

        let hours = lastDate - dataCreationOrder;
        hours = Math.round(hours);

        dataCreationOrder = lastDate;
        let oldRole = log.oldRole;

        if (!status["s" + oldRole]) {
          status["s" + oldRole] = 0;
        }
        status["s" + oldRole] += hours;

      };
      order.status = status;
    }
  }

  async search() {
    this.orders = await this.orderService.find(null, this.term);
  }

  async getNextPage() {
    const orders = await this.orderService.find(this.filter, this.term, this.orders.length);
    this.orders.push(...orders);
  }

  async openModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: StorageModalComponent,
      componentProps: { order }
    })
    await modal.present()
  }

  ngOnInit() {
  }

  async onFilterChange(filter) {

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
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
  }

}