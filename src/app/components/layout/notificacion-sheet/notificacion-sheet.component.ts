import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { NotificacionUsuario } from 'src/app/models/proyectos/dashboard.model';
import { AppService } from 'src/app/shared/app.service';
import { AppConstants } from 'src/app/shared/routing/app.constants';

@Component({
  templateUrl: './notificacion-sheet.component.html',
  styleUrls: ['./notificacion-sheet.component.css']
})
export class NotificacionSheetComponent implements OnInit, OnDestroy {

  notificaciones: NotificacionUsuario[] = [];
  private subs: Subscription[] = [];

  constructor(
    private appService: AppService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const path = AppConstants.PATH_NOTIFICACIONES;
    this.subs.push(this.appService.getRequest(path).subscribe(res => {
      this.notificaciones = res.body as NotificacionUsuario[];
      this.changeDetectorRef.markForCheck();
    }));
  }

  eliminarNotificacion(idNotificacion): void {
    const path = AppConstants.PATH_NOTIFICACIONES + '/';
    this.appService.deleteRequest(path + idNotificacion).then(() => {
      this.notificaciones = this.notificaciones.filter(not => not.idNotificacionUsuario !== idNotificacion);
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
