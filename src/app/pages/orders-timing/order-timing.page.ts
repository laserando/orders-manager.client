import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { StorageModalComponent } from 'src/app/components/modal/storage-modal.component';
import { LogModel } from 'src/app/models/log.model';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { Router } from '@angular/router';
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
  public states: any[] = [];
  public loader: HTMLIonLoadingElement;


  constructor(private orderService: OrdersService,
    private modalCtrl: ModalController, private loadingController: LoadingController, private router: Router) { }

  async ionViewWillEnter() {
    await this.present();
    this.orders = await this.orderService.find(this.filter, null, 0, 20, 'deliveryDate:ASC');
    this.timingCalc(this.orders);
    this.loader.dismiss();
  }


  async present() {
    this.loader = await this.loadingController.create({
      message: 'Loading...'
    });
    this.loader.present().then();
  }

  async search() {

    this.orders = await this.orderService.find(this.filter, this.term);
    this.timingCalc(this.orders);
  }

  async getNextPage() {
    await this.present();
    const orders = await this.orderService.find(this.filter, this.term, this.orders.length);
    this.orders.push(...orders);
    this.timingCalc(this.orders);
    this.loader.dismiss();
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
    this.timingCalc(this.orders);
  }

  timingCalc(orders) {  //TODO: need to  improve
    for (let order of orders) {
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


  seePreview(order) {
    this.router.navigate([`/dashboard/preview/${order.id}`]);
  }


}

