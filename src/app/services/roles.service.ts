import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';;

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  public URL: string = "http://localhost:1337/users-permissions/roles"

  constructor(private http: HttpClient) { }

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
