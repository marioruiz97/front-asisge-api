import { Injectable } from '@angular/core';
import { AppMenu, NavItem } from './routing/app-menu';
import { Response } from './app.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../components/layout/confirm-dialog/confirm-dialog.component';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

export interface ConfirmDialogData {
  title: string;
  message: string;
  errors?: string[];
  confirm?: string;
}

@Injectable()
export class UiService {

  private appMenu = new AppMenu();
  loadingState = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router) { }

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
      horizontalPosition: 'end'
    });
  }

  putSnackBar(promise: Promise<any>): Observable<boolean> {
    return new Observable(exito => {
      promise.then((res: Response) => {
        this.showSnackBar(res.message, 4);
        exito.next(true);
      }).catch(err => {
        exito.next(false);
        if (err.status === 401) {
          this.showSnackBar('La sesión ha expirado, ingresa al sistema', 3);
          this.router.navigate(['/login']);
          return;
        }
        if (err.status === 403) {
          this.showConfirm({ title: 'Acceso Denegado', message: 'No tienes acceso a este recurso', confirm: 'Ok' });
          this.router.navigate(['/home']);
          return;
        }
        if (err.error) {
          const errors: string[] = err.error.errors;
          this.showConfirm({ title: 'Error', message: err.error.message, errors, confirm: 'Ok' });
        } else {
          this.showConfirm({ title: 'Error', message: 'Ha ocurrido un error interno', confirm: 'Ok' });
        }
      });
    });
  }

  showConfirm(data: ConfirmDialogData) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: data.title,
        message: data.message,
        errors: data.errors ? data.errors : [],
        confirm: data.confirm
      }
    });
  }

}
