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
      // send cloned request with header to the next handler.
      // return next.handle(authReq);
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
        if (err.status === 404) {
          const message = err.error && err.error.message ? err.error.message : 'Ha ocurrido un error. Intenta nuevamente';
          this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
        }
        return throwError(err);
      })
    );

  }
}
