import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public URL: string = "http://localhost:1337/auth/local";
  private token: string;
  private user: string;
  private authenticate: boolean = false;

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
        this.authenticateForLogin()
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

  authenticateForLogin() {
    this.authenticate = true
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
