import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppService } from '../shared/app.service';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { UiService } from '../shared/ui.service';

export interface TokenInfo {
  userid: number;
  email: string;
  roles?: string[];
  token?: string;
}

@Injectable()
export class AuthService {

  private $isAuthenticated = false;
  authState = new Subject<boolean>();
  private currentAuthInfo: TokenInfo;

  constructor(private appService: AppService, private router: Router, private uiService: UiService) { }

  initAuth() {
    const payload = this.token ? JSON.parse(atob(this.token.split('.')[1])) : null;
    if (payload) {
      this.authState.next(true);
      this.$isAuthenticated = true;
      this.currentAuthInfo = {
        userid: payload.usuario_id, email: payload.usuario_email, roles: payload.authorities
      };
    }
  }

  login(authData: AuthData) {
    this.appService.loginRequest(authData).then(res => {
      if (res && res.usuario_enabled) {
        this.authState.next(true);
        this.$isAuthenticated = true;
        this.currentAuthInfo = {
          userid: res.usuario_id, email: res.usuario_email, roles: res.usuario_roles
        };
        this.saveToken(res.access_token);
        this.goToHome();
      }
    }).catch(err => {
      console.log(err);
      this.authState.next(false);
      this.$isAuthenticated = false;
      this.goToLogin();
      this.uiService.showSnackBar('Usuario o contraseña incorrectas, intenta nuevamente', 3);
    });
  }

  private saveToken(token: string) {
    this.currentAuthInfo.token = token;
    sessionStorage.removeItem('token');
    sessionStorage.setItem('token', token);
  }

  get currentUser() {
    return this.currentAuthInfo;
  }

  get token() {
    let token = this.currentAuthInfo ? this.currentAuthInfo.token : null;
    if (token != null) {
      return token;
    } else if (token == null && sessionStorage.getItem('token') != null) {
      token = sessionStorage.getItem('token');
      if (this.currentAuthInfo) { this.currentAuthInfo.token = token; }
      return token;
    }
    return null;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  isAuthenticated() {
    this.authState.next(this.$isAuthenticated);
    return this.$isAuthenticated;
  }

  hasRole(role: string) {
    if (this.currentAuthInfo && this.currentAuthInfo.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout() {
    this.uiService.showSnackBar('Se ha cerrado sesión', 3);
    this.currentAuthInfo = null;
    this.$isAuthenticated = false;
    this.authState.next(false);
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    this.goToLogin();
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
