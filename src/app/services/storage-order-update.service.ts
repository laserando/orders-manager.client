import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { StorageOrderUpdate } from '../models/storage-order-update.model';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class storageOrderUpdateService {

  public URL: string = `${Global.ENDPOINT.BASE}/storage-order-updates`

  constructor(private httpClient: HttpClient) { }

  findAll() {
  }

  add(item: StorageOrderUpdate) {
    console.log("ordr",item.order)
    return this.httpClient.post<StorageOrderUpdate>(this.URL, item).toPromise();
  }

  storageModifyCount(order: Order) {
    let count = 0;
    for (let storage of order.storageOrderUpdates) {
      count++;
    }
    return count;
  }
}
