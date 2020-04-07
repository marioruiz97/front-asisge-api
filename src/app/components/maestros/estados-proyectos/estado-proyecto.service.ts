import { Injectable } from '@angular/core';
import { AppConstants as Constant } from 'src/app/shared/routing/app.constants';
import { AppService, Response } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EstadoProyecto } from 'src/app/models/proyectos/proyecto.model';

@Injectable()
export class EstadoProyectoService {

  private estadoPath = Constant.PATH_ESTADO_PROYECTO;

  constructor(
    private appService: AppService, private uiService: UiService, private router: Router
  ) { }

  fetchAll(): Observable<Response> {
    return this.appService.getRequest(this.estadoPath);
  }

  fetchById(id: string | number) {
    return this.appService.getRequest(`${this.estadoPath}/${id}`).toPromise();
  }


  create(data: EstadoProyecto) {
    this.uiService.putSnackBar(this.appService.postRequest(this.estadoPath, data))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }
  update(id: number, data: EstadoProyecto) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.estadoPath}/${id}`, data))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }

  delete(id: string): Observable<boolean> {
    return new Observable(observer => {
      const data = {
        title: 'Estás seguro de eliminar el Estado proyecto?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar Estado'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.appService.deleteRequest(`${this.estadoPath}/${id}`)
            .then((res: Response) => {
              this.uiService.showSnackBar(res.message, 4);
              observer.next(true);
            })
            .catch(_ => {
              const dialog = { title: 'Error', message: 'No se ha podido eliminar Estado: ' + id, confirm: 'Ok' };
              this.uiService.showConfirm(dialog);
              observer.next(false);
            });
        }
      });
    });
  }

  returnToList() {
    this.router.navigate(['/estado-proyecto']);
  }


}
