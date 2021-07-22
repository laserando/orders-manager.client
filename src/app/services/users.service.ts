import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import qs from 'qs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public URL: string = "http://localhost:1337/users"

  constructor(private http: HttpClient) { }

  find(where: any = null, q: string = null, start: number = 0, limit: number = 20, sort: string = null) {
    const query: any = {
      _start: start || 0,
      _limit: limit || 20
    }

    if (q) query._q = q;
    if (where) query._where = where;
    if (sort) query._sort = sort;

    return this.http.get<User[]>(`${this.URL}?${qs.stringify(query)}`).toPromise();
  }

  findById(id: number) {
    return this.http.get<User>(this.URL + "/" + id).toPromise()
  }

  addUser(dataUser: User) {
    return this.http.post<User>(this.URL, dataUser).toPromise()
  }

  updateUser(id: number, newUser: User) {
    return this.http.put<User>(this.URL + "/" + id, newUser).toPromise()
  }

  deleteUser(id: number) {
    return this.http.delete<User>(this.URL + "/" + id).toPromise()
  }
}
