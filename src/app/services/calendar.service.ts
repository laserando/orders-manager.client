import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx/index';
import { Order } from '../models/order.model';
import { OrdersService } from './orders.service';

@Injectable({
  providedIn: 'root'
})

export class CalendarService {

  constructor(private ordersService:OrdersService){}

  public orders:Order[] = [];
  public from:Date;
  public to:Date;

  async currentData(calendarComponent){
    this.from = calendarComponent.currentData.currentDate;
    this.to = new Date(this.from.getFullYear(), this.from.getMonth() + 1, 1);
    this.orders =  await this.ordersService.find(this.getFilters())
    return this.orders
    }
  
    private getFilters() {
      return {
        isArchived: false,
        deliveryDate_gte: this.from,
        deliveryDate_lte: this.to
      };
    }



}
