import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, CalendarOptions, Action } from '@fullcalendar/angular';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, AfterViewInit {


  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  public orders: Order[] = []
  public calendarOptions: CalendarOptions;
  public from: Date;
  public to: Date;
  public filter: any;
  // public url: string = `${Global.ENDPOINT.TEST}/dashboard/preview/`

  constructor(private ordersService: OrdersService,
    private calendarService: CalendarService) { }


  async ngOnInit() {
    const today = new Date();
    this.from = new Date(today.getFullYear(), today.getMonth(), 1);
    this.to = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.filter = { isArchived: false, deliveryDate_gte: this.from, deliveryDate_lte: this.to };
    this.orders = await this.ordersService.find(this.filter);
    console.log(this.orders.map(order => order))

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      height: '100%',
      events:
        this.orders.map(res => {

          let id = res.id.toString();
          return {
            title: "CONSEGNA ORDINE N° :" + id, date: res.deliveryDate
            /*,url: this.url + id*/
          };
        })
    };
  }

  ngAfterViewInit() {
  }

  async ionViewWillEnter() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      height: '100%',
      events:
        this.orders.map(res => {
          let id = res.id.toString();
          return { title: "CONSEGNA ORDINE N° :" + id, date: res.deliveryDate  /*,url: this.url + id*/ };
        })
    };

    setTimeout(() => {
      this.calendarComponent.getApi().next = async () => {
        this.calendarComponent.getApi().dispatch({ type: 'NEXT' });
        this.orders = await this.calendarService.currentData(this.calendarComponent.getApi());
        this.ionViewWillEnter();
      }
      this.calendarComponent.getApi().prev = async () => {
        this.calendarComponent.getApi().dispatch({ type: 'PREV' });
        this.orders = await this.calendarService.currentData(this.calendarComponent.getApi());
        this.ionViewWillEnter();
      }
      this.calendarComponent.getApi().today = async () => {
        this.calendarComponent.getApi().dispatch({ type: 'CHANGE_DATE', dateMarker: new Date() });
        this.filter = { isArchived: false, deliveryDate_gte: this.from, deliveryDate_lte: this.to };
        this.orders = await this.ordersService.find(this.filter);
        this.ionViewWillEnter();
      }
    }, 500)
  }
}



