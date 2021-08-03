import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from "../models/order.model";
import qs from 'qs';
import { LogService } from './log.service';
import { NoteService } from './note.service';
import { ClientService } from './client.service';
import { ClientModel } from '../models/client.model';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  public URL: string = `${Global.ENDPOINT.BASE}/orders`;

  constructor(private http: HttpClient,
    private logService: LogService,
    private noteService: NoteService,
    private clientService: ClientService) { }

  find(where: any = null, q: string = null, start: number = 0, limit: number = 20, sort: string = null) {
    const query: any = {
      _start: start || 0,
      _limit: limit || 20
    }

    if (q) query._q = q;
    if (where) query._where = where;
    if (sort) query._sort = sort;

    return this.http.get<Order[]>(`${this.URL}?${qs.stringify(query)}`).toPromise();
  }

  async addOrder(order: Order, client: ClientModel) {
    order.client = client.id ? client : await this.clientService.addCustomer(client);
    return this.http.post(this.URL, order).toPromise();
  }

  findById(id) {
    return this.http.get<Order>(this.URL + "/" + id).toPromise();
  }

  async updateOrder(newOrder: Order, id: number) {
    let oldRole = (await this.findById(id)).role;
    let newRole = newOrder.role;
    let order = newOrder;
    if (oldRole.name != newRole.name) {
      let notes = prompt("VUOI LASCIARE UNA NOTA?");
      await this.logService.addLog(oldRole.id, newRole, order.id);
      if (notes) {
        await this.noteService.addNote(notes, oldRole.id, newRole, order.id);
      }
    }
    delete newOrder.logs;
    delete newOrder.notes;
    await this.http.put(this.URL + "/" + id, newOrder).toPromise();
    return;
  }

  deleteOrder(id: number) {
    return this.http.delete(this.URL + "/" + id).toPromise();
  }



}
