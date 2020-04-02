import { Injectable } from '@angular/core';
import { AppMenu, NavItem } from './routing/app-menu';

@Injectable()
export class UiService {

  private appMenu = new AppMenu();

  constructor() { }

  get menu(): NavItem[] {
    return this.appMenu.menu;
  }

  get settings(): NavItem[] {
    return this.appMenu.settings;
  }

  get children() {
    return this.appMenu.menu.filter(menu => menu.children && menu.children.length > 0);
  }

  get noChild() {
    return this.appMenu.menu.filter(menu => !(menu.children));
  }
}
