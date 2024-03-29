import { Injectable } from '@angular/core';
import { Response } from './app.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../components/layout/confirm-dialog/confirm-dialog.component';
import { Observable, Subject } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  errors?: string[];
  confirm?: string;
}

@Injectable()
export class UiService {

  loadingState = new Subject<boolean>();
  dashboardLoading = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  showSnackBar(message: string, durationInSec: number, action?: string) {
    return this.snackBar.open(message, action ? action : 'Ok', {
      duration: durationInSec * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });
  }

  putSnackBar(promise: Promise<any>): Observable<boolean> {
    this.loadingState.next(true);
    return new Observable(exito => {
      promise.then((res: Response) => {
        this.showSnackBar(res.message, 4);
        this.loadingState.next(false);
        exito.next(true);
      }).catch(err => {
        this.loadingState.next(false);
        exito.next(false);
        if (err.status !== 403) {
          const message = err.error ? err.error.message : 'Ha ocurrido un error interno';
          const errors: string[] = err.error && err.error.errors ? err.error.errors : [];
          this.showConfirm({ title: 'Error', message, errors, confirm: 'Ok' });
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
