import { Injectable } from '@angular/core';
import { AppMenu, NavItem } from './routing/app-menu';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {

  private appMenu = new AppMenu();
  menuSubject = new Subject<NavItem[]>();
  roles: string[];

  constructor() { }

  selectMenu() {
    if (this.roles.includes('ROLE_ADMIN')) {
      this.menuSubject.next(this.appMenu.menuAdmin);
    } else if (this.roles.includes('ROLE_ASESOR')) {
      this.menuSubject.next(this.appMenu.menuAsesor);
    } else {
      this.menuSubject.next(this.appMenu.menuCliente);
    }
  }

  get menu() {
    return this.menuSubject;
  }
  get settings(): NavItem[] {
    return this.appMenu.settings;
  }

  getChildren(menu: NavItem[]): NavItem[] {
    return menu.filter(item => item.children && item.children.length > 0);
  }

  getNoChild(menu: NavItem[]): NavItem[] {
    return menu.filter(item => !(item.children));
  }
}
