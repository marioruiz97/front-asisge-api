import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      if (this.isExpiredToken()) {
        this.authService.logout();
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  isExpiredToken() {
    const token = this.authService.token;
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const now = new Date().getTime() / 1000;

    return payload === null || payload.exp < now ? true : false;
  }

}
