import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TagModel} from '../models/tag.model';
import qs from 'qs';
import {Global} from './global';
import {BehaviorSubject, Observable} from "rxjs";
import {Tag} from "@angular/compiler/src/i18n/serializers/xml_helper";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tags: BehaviorSubject<TagModel[]> = new BehaviorSubject<TagModel[]>([]);

  private URL = `${Global.ENDPOINT.BASE}/tags`;

  constructor(private http: HttpClient) {
    this.find().then(
      f => this.tags.next(f)
    );
  }

  getTags(): Observable<TagModel[]> {
    return this.tags.asObservable();
  }

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

  findById(id: number) {
    return this.http.get<TagModel>(this.URL + "/" + id).toPromise()
  }

  addTag(dataTag: TagModel) {
    return this.http.post<TagModel>(this.URL, dataTag).toPromise().then(
      f => {
        this.tags.next([...this.tags.value, f]);
        return f;
      }
    );
  }

  updateTag(id: number, newDataTag: TagModel) {
    return this.http.put<TagModel>(this.URL + "/" + id, newDataTag).toPromise()
  }

  deleteTag(id: number) {
    return this.http.delete<TagModel>(this.URL + "/" + id).toPromise().then(
      f => {
        this.tags.next(
          this.tags.value.filter(item => item.id !== id)
        );
      }
    );
  }
}
