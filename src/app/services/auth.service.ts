import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public URL: string = `${Global.ENDPOINT.BASE}/auth/local`;
  private token: string;
  private user: string;
  
  constructor(private http: HttpClient) {
    if (localStorage.getItem('token')) {
      this.setToken(localStorage.getItem('token'));
    }
  }

  login(identifier: string, password: string) {
    const request = this.http.post<{ jwt: string, user: any }>(this.URL, { identifier, password }).toPromise()
      .then(res => {
        this.setToken(res.jwt);
        this.setUser(res.user);
      });
    return request;
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', this.token);
      return;
    }
    localStorage.removeItem('token');
  }

  getUser() {
    return this.user || JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticate(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.setToken(null);
    this.setUser(null);
  }

  getParseOfUserObject(): string {
    let userJson = this.getUser();
    return userJson.role.name;
  }


  private setUser(user: string) {
    this.user = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(this.user));
      return;
    }
    localStorage.removeItem('user')
  }

}
