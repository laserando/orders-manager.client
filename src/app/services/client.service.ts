import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import qs from 'qs'
import { ClientModel } from '../models/client.model';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  URL: string = `${Global.ENDPOINT.BASE}/clients`

  constructor(private http: HttpClient) { }

  find(where: any = null, q: string = null, start: number = 0, limit: number = 20, sort: string = null) {
    const query: any = {
      _start: start || 0,
      _limit: limit || 20
    }

    if (q) query._q = q;
    if (where) query._where = where;
    if (sort) query._sort = sort;

    return this.http.get<ClientModel[]>(`${this.URL}?${qs.stringify(query)}`).toPromise();
  }


  findById(clientId) {
    return this.http.get<ClientModel>(this.URL + "/" + clientId).toPromise();
  }

  addCustomer(client: ClientModel) {
    return this.http.post<ClientModel>(this.URL, client).toPromise()
  }

  updateCustomer(newClient: ClientModel) {
    return this.http.put<ClientModel>(this.URL + "/" + newClient.id, newClient).toPromise()
  }

  deleteCustomer(clientId){
    return this.http.delete<ClientModel>(this.URL+ "/" + clientId).toPromise()
  }
}
