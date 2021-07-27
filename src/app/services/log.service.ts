import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogModel } from '../models/log.model';
import qs from 'qs';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  public URL: string = `${Global.ENDPOINT.BASE}/logs`;

  constructor(private http: HttpClient) { }

  find(where: any = null, q: string = null, start: number = 0, limit: number = 20, sort: string = null) {
    const query: any = {
      _start: start || 0,
      _limit: limit || 20
    }

    if (q) query._q = q;
    if (where) query._where = where;
    if (sort) query._sort = sort;

    return this.http.get<LogModel[]>(`${this.URL}?${qs.stringify(query)}`).toPromise();
  }

  addLog(oldRole, newRole, order) {
    this.http.post<LogModel>(this.URL, { oldRole, newRole, order }).toPromise();
  }
}
