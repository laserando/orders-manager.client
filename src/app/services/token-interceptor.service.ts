import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    const token = localStorage.getItem("token");
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    request = request.clone({
      setHeaders: headers
    });

    return next.handle(request).pipe(
      catchError(error => {
        switch (error.status) {
          case 401:
            this.authService.logout()
            this.router.navigate(["/login"]);
            break;
        }
        return throwError(error);
      })
    );
  }
}
