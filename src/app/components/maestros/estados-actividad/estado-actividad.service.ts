import { Injectable } from '@angular/core';
import { EstadoActividad } from 'src/app/models/proyectos/estado-actividad.model';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UiService } from 'src/app/shared/ui.service';
import { AppService } from 'src/app/shared/app.service';

@Injectable()
export class EstadoActividadService {

  private path = Cons.PATH_ESTADO_ACTIVIDAD;

  constructor(
    private appService: AppService, private uiService: UiService, private router: Router
  ) { }

  fetchAllEstados() {
    return this.appService.getRequest(this.path);
  }

  fetchEstadoById(idEstado: number) {
    return this.appService.getRequest(`${this.path}/${idEstado}`).toPromise();
  }

  create(estado: EstadoActividad) {
    this.uiService.putSnackBar(this.appService.postRequest(this.path, estado))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }

  update(idEstado: number, estado: EstadoActividad) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.path}/${idEstado}`, estado))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }

  delete(idEstado: number) {
    return new Observable(observer => {
      const data = {
        title: 'Estás seguro de eliminar el Estado Actividad?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar Estado'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.uiService.putSnackBar(this.appService.deleteRequest(`${this.path}/${idEstado}`))
            .subscribe(exito => observer.next(exito));
        }
      });
    });
  }

  returnToList() {
    this.router.navigate(['/estado-actividad']);
  }

  showNotFound(err: any) {
    const message = err.error ? err.error.message : 'No se han podido obtener datos';
    this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
    this.returnToList();
  }

}
