import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { UiService } from 'src/app/shared/ui.service';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private uiService: UiService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.authService.token;
    let authReq = req;

    if (authToken) {
      authReq = req.clone({
        setHeaders: { Authorization: 'Bearer ' + authToken }
      });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401 && this.authService.isAuthenticated()) {
          this.authService.sessionHasExpired();
        }
        if (err.status === 403) {
          this.uiService.showConfirm({ title: 'Acceso Denegado', message: 'No tienes acceso a este recurso', confirm: 'Ok' });
          this.authService.goToHome();
        }
        return throwError(err);
      })
    );
  }
}
