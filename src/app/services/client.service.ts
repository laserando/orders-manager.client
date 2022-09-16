import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import qs from 'qs'
import {ClientModel} from '../models/client.model';
import {Global} from './global';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clients: BehaviorSubject<ClientModel[]> = new BehaviorSubject<ClientModel[]>([]);
  private clientUpdated: Subject<ClientModel> = new Subject<ClientModel>();
  private clientAdded: Subject<ClientModel> = new Subject<ClientModel>();
  public URL: string = `${Global.ENDPOINT.BASE}/clients`

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

  getClientUpdated(): Observable<ClientModel> {
    return this.clientUpdated.asObservable();
  }

  getClientAdded(): Observable<ClientModel> {
    return this.clientAdded.asObservable();
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
    return this.http.post<ClientModel>(this.URL, client).toPromise().then(f => {
      this.clientAdded.next(f);
      return f;
    });
  }

  updateCustomer(newClient: ClientModel) {
    return this.http.put<ClientModel>(this.URL + "/" + newClient.id, newClient).toPromise().then(f => {
      this.clientUpdated.next(newClient);
      return f;
    });
  }

  deleteCustomer(clientId) {
    return this.http.delete<ClientModel>(this.URL + "/" + clientId).toPromise().then(f => {
      return f;
    });
  }
}
