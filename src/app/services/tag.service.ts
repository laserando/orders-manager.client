import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TagModel } from '../models/tag.model';
import qs from 'qs';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  public URL: string = `${Global.ENDPOINT.BASE}/tags`

  constructor(private http: HttpClient) { }

  find(where: any = null, q: string = null, start: number = 0, limit: number = 20, sort: string = null) {
    const query: any = {
      _start: start || 0,
      _limit: limit || 20
    }

    if (q) query._q = q;
    if (where) query._where = where;
    if (sort) query._sort = sort;

    return this.http.get<TagModel[]>(`${this.URL}?${qs.stringify(query)}`).toPromise()
    .then(res => res)
  }

  findById(id : number) {
    return this.http.get<TagModel>(this.URL + "/" + id).toPromise()
  }

  addTag(dataTag : TagModel) {
    return this.http.post<TagModel>(this.URL, dataTag).toPromise()
  }

  updateTag(id: number, newDataTag : TagModel) {
    return this.http.put<TagModel>(this.URL + "/" + id, newDataTag).toPromise()
  }

  deleteTag(id : number) {
    return this.http.delete<TagModel>(this.URL + "/" + id).toPromise()
  }
}
