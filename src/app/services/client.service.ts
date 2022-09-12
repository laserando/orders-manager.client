import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import qs from 'qs'
import {ClientModel} from '../models/client.model';
import {Global} from './global';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clients: BehaviorSubject<ClientModel[]> = new BehaviorSubject<ClientModel[]>([]);
  public URL: string = `${Global.ENDPOINT.BASE}/clients`
  public newClient: ClientModel[] = [];

  constructor(private http: HttpClient) {
    this.init();
  }

  init() {
    this.find().then(
      f => this.clients.next(f.map(item => {
        const res: any = {...item};
        res.fullName = item.name + ' ' + item.surname;
        return res;
      }))
    );
  }

  getClients(): Observable<ClientModel[]> {
    return this.clients.asObservable();
  }

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
    this.newClient.push(client);
    return this.http.post<ClientModel>(this.URL, client).toPromise().then(f => {
      this.init();
      return f;
    });
  }

  checkClient() {
    if (this.newClient.length > 0) {
      this.newClient = [];
      return true;
    } else {
      return false;
    }
  }

  updateCustomer(newClient: ClientModel) {
    return this.http.put<ClientModel>(this.URL + "/" + newClient.id, newClient).toPromise().then(f => {
      this.init();
      return f;
    });
  }

  deleteCustomer(clientId) {
    return this.http.delete<ClientModel>(this.URL + "/" + clientId).toPromise().then(f => {
      this.init();
      return f;
    });
  }
}
