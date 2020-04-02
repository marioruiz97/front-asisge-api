import { Injectable } from '@angular/core';
import { AppMenu, NavItem } from './routing/app-menu';
import { Response } from './app.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UiService {

  private appMenu = new AppMenu();

  constructor(private snackBar: MatSnackBar) { }

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

  showSnackBar(message: string, durationInSec: number, action?: string) {
    return this.snackBar.open(message, action ? action : 'Ok', {
      duration: durationInSec * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'start'
    });
  }

  putSnackBar(promise: Promise<any>) {
    promise.then((res: Response) => this.showSnackBar(res.message, 3))
      .catch(err => console.log(err));
  }
}
