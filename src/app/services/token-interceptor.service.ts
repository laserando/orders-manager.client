import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req, next) {
    let TokenizedReq = req;
    if (this.authService.getToken()) {
      TokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
    }

    return next.handle(TokenizedReq)
  }
}
