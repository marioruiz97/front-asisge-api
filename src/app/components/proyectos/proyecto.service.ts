import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService, Response } from 'src/app/shared/app.service';
import { AppConstants } from 'src/app/shared/routing/app.constants';
import { UiService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { Proyecto } from 'src/app/models/proyectos/proyecto.model';

@Injectable()
export class ProyectoService {

  private proyectoPath = AppConstants.PATH_PROYECTOS;

  constructor(private appService: AppService, private uiService: UiService, private router: Router) { }

  fetchProyectos(): Observable<Response> {
    return this.appService.getRequest(this.proyectoPath);
  }

  fetchEstados(idEstadoActual: number): Observable<Response> {
    const path = AppConstants.PATH_ESTADO_PROYECTO;
    return this.appService.getRequest(`${path}/${idEstadoActual}/estados-siguientes`);
  }

  getProyecto(id: number) {
    const path = this.proyectoPath;
    return this.appService.getRequest(`${path}/${id}`).toPromise();
  }

  showNotFound(err) {
    const message = err.error ? err.error.message : 'Ha ocurrido un error';
    this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
  }

  crearProyecto(data: Proyecto) {
    this.uiService.loadingState.next(true);
    const proyecto = { ...data, estadoProyecto: 1 };
    this.appService.postRequest(this.proyectoPath, proyecto).then((res: Response) => {
      this.gotoDashboard(res.body.idProyecto);
      this.uiService.loadingState.next(false);
      this.uiService.showSnackBar(res.message, 4);
    }).catch(err => {
      this.uiService.loadingState.next(false);
      if (err.error && err.status !== 403) {
        const errors: string[] = err.error.errors;
        this.uiService.showConfirm({ title: 'Error', message: err.error.message, errors, confirm: 'Ok' });
      } else if (err.status !== 403) {
        this.uiService.showConfirm({ title: 'Error', message: 'Ha ocurrido un error interno', confirm: 'Ok' });
      }
      if (err.status === 500) {
        this.returnToList();
      }
    });
  }

  editarProyecto(idProyecto: number, data: Proyecto) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.proyectoPath}/${idProyecto}`, data)).subscribe(exito => {
      if (exito) { this.gotoDashboard(idProyecto); }
    });
  }

  pasarEstadoProyecto(idProyecto: number, idEstado: number) {
    return this.uiService.putSnackBar(this.appService.postRequest(`${this.proyectoPath}/${idProyecto}?estado=${idEstado}`, {}));
  }

  gotoDashboard(idProyecto: number) {
    this.router.navigate(['/proyectos/' + idProyecto]);
  }

  returnToList() {
    this.router.navigate(['/proyectos']);
  }

  gotoClientes() {
    this.router.navigate(['/clientes']);
  }

}
