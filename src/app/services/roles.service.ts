import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';
import { Global } from './global';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);

  public URL: string = `${Global.ENDPOINT.BASE}/users-permissions/roles`

  constructor(private http: HttpClient) {
    this.find().then(
      f => this.roles.next(f)
    );
  }

  getRoles() {
    return this.roles.asObservable();
  }

  find() {
    return this.http.get<{ roles: Role[] }>(this.URL).toPromise()
      .then(res => res.roles)
      .then(res => res.filter(response => response.name != "Public"))
  }

  findById(id: number) {
    return this.http.get<Role>(this.URL + "/" + id).toPromise()
  }

  addProcessing(newRole: Role) {
    return this.http.post<Role>(this.URL, newRole).toPromise()
  }

  updateProcessing(id: number, newRole: Role) {
    return this.http.put<Role>(this.URL + "/" + id, newRole).toPromise()
  }

  deleteProcessing(id: number) {
    return this.http.delete<Role>(this.URL + "/" + id).toPromise()
  }
}
