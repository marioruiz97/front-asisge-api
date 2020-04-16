import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppService } from '../shared/app.service';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { UiService } from '../shared/ui.service';
import { isUndefined } from 'util';
import { MenuService } from '../shared/menu.service';
import { AppConstants as Constant } from '../shared/routing/app.constants';

export interface TokenInfo {
  userid: number;
  email: string;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private $isAuthenticated = false;
  authState = new Subject<boolean>();
  private currentAuthInfo = new Subject<TokenInfo>();
  private appToken: string;
  private appRoles: string[];

  constructor(
    private appService: AppService, private router: Router,
    private uiService: UiService, private menuService: MenuService
  ) { }

  initAuth() {
    const payload = this.token ? JSON.parse(atob(this.token.split('.')[1])) : null;
    if (payload) {
      this.authState.next(true);
      this.$isAuthenticated = true;
      this.appRoles = payload.authorities;
      this.menuService.roles = this.appRoles;
      this.menuService.selectMenu();
      this.currentAuthInfo.next({
        userid: payload.usuario_id, email: payload.usuario_email, nombre: payload.usuario_name
      });
    }
  }

  login(authData: AuthData) {
    this.appService.loginRequest(authData).then(res => {
      if (res) {
        this.saveToken(res.access_token);
        this.initAuth();
        this.goToHome();
      }
    }).catch(err => {
      this.authState.next(false);
      this.$isAuthenticated = false;
      this.goToLogin();
      let message: string = err.error ? err.error.error_description : 'Ha ocurrido un problema, vuelve a intentar';
      if (message === 'User is disabled') {
        message = 'Usuario Inactivo, primero debe activarse';
      } else if (message === 'User account is locked') {
        message = 'Debes validar tu correo electrónico antes de iniciar sesión';
      } else {
        message = 'Usuario o contraseña incorrectas, intenta nuevamente';
      }
      this.uiService.showSnackBar(message, 3);
    });
  }

  resetPassword(correo: string) {
    const data = { correo };
    this.appService.postRequest(Constant.PATH_RECUPERAR, data)
      .then(res => this.uiService.showSnackBar(res.message, 3))
      .catch(err => this.uiService.showSnackBar(err.error.message, 3));
  }

  private saveToken(token: string) {
    this.appToken = token;
    sessionStorage.removeItem('token');
    sessionStorage.setItem('token', token);
  }

  get currentUser() {
    return this.currentAuthInfo;
  }

  get token() {
    if (this.appToken) {
      return this.appToken;
    } else if (this.appToken == null && sessionStorage.getItem('token') != null) {
      this.appToken = sessionStorage.getItem('token');
      return this.appToken;
    }
    return null;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  isAuthenticated(notify: boolean = false) {
    if (notify) {
      this.authState.next(this.$isAuthenticated);
    }
    return this.$isAuthenticated;
  }

  hasRole(role: string) {
    if (this.appRoles && this.appRoles.includes(role)) {
      return true;
    }
    return false;
  }

  hasRoles(roles: string[]) {
    if (isUndefined(roles)) {
      return true;
    }
    let result = false;
    for (const rol of roles) {
      if (this.hasRole(rol)) {
        result = true;
        break;
      }
    }
    return result;
  }

  logout() {
    this.uiService.showSnackBar('Se ha cerrado sesión', 3);
    this.currentAuthInfo.next(null);
    this.appToken = null;
    this.appRoles = [];
    this.$isAuthenticated = false;
    this.authState.next(false);
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    this.goToLogin();
  }


  sessionHasExpired() {
    this.uiService.showConfirm({ title: 'La sesión ha expirado!', message: 'Ingresa al sistema nuevamente', confirm: 'Ok' });
    this.logout();
  }


  redirect(to: string) {
    switch (to) {
      case 'fb':
        window.open('https://www.facebook.com/ASISGE', '_blank');
        break;
      case 'twitter':
        window.open('https://twitter.com/asisgesa', '_blank');
        break;
      case 'email':
        const mail = document.createElement('a');
        mail.href = 'mailto:gerencia@asisge.com';
        mail.click();
        break;
      default:
        window.open('http://asisge.com/', '_blank');
        break;
    }
  }
}
