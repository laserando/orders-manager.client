import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {

  public order: Order;

  constructor(private ordersService: OrdersService,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.order = await this.ordersService.findById(this.route.snapshot.params.id);
  }

  async ionViewWillEnter() {
    this.order = await this.ordersService.findById(this.route.snapshot.params.id);
  }

}
