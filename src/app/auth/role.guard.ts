import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private ROLE = 'roles';

  constructor(private router: Router, private authService: AuthService, private uiService: UiService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const roles = next.data[this.ROLE] as string[];
    let hasRole = false;
    roles.forEach(rol => {
      if (this.authService.hasRole(rol)) {
        hasRole = true;
      }
    });
    if (hasRole) {
      return true;
    }

    this.uiService.showConfirm({ title: 'Acceso Denegado', message: 'No tienes acceso a este recurso', confirm: 'Ok' });
    this.router.navigate(['/home']);
    return false;
  }

}
