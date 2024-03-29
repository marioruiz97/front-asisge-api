import { Injectable } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppService } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { EtapaPlan, AprobacionPlan, Cierre } from 'src/app/models/proyectos/plan-trabajo.model';
import { Subject, Observable } from 'rxjs';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { Router } from '@angular/router';
import { ActividadDto, Seguimiento, Actividad } from 'src/app/models/proyectos/actividad.model';
import { PlanTrabajoBoard } from 'src/app/models/proyectos/plan-trabajo-board.model';
import { TiempoService } from '../dashboard/tiempos/tiempo.service';

@Injectable()
export class PlanTrabajoService {

  private idProyecto: number;

  planActual: PlanTrabajoBoard;
  planActualSubject = new Subject<PlanTrabajoBoard>();

  private planTrabajoPath = Cons.PATH_PLANES_TRABAJO;
  private etapasPath = Cons.PATH_ETAPA_PLAN;
  private actividadPath = Cons.PATH_ACTIVIDADES_PLAN;
  private seguimientoPath = Cons.PATH_SEGUIMIENTOS;

  constructor(
    private dashboardService: DashboardService,
    private appService: AppService,
    private uiService: UiService,
    private tiempoService: TiempoService,
    private router: Router
  ) { }

  fetchPlanesDeTrabajo(idProyecto: number) {
    const path = this.planTrabajoPath.replace('{idProyecto}', idProyecto.toString());
    this.idProyecto = idProyecto;
    return this.appService.getRequest(path);
  }

  limpiarPlan(id: number) {
    if (!this.idProyecto || this.idProyecto !== id) {
      this.planActual = null;
      this.planActualSubject.next(null);
    }
  }

  selectActual(id: number) {
    if (this.planActual && this.planActual.idPlanDeTrabajo && this.planActual.idPlanDeTrabajo === id) {
      this.setProperties(this.planActual);
    } else {
      const path = Cons.PATH_PLAN_TRABAJO_ID;
      this.appService.getRequest(`${path}/${id}`).subscribe(res => {
        this.setProperties(res.body as PlanTrabajoBoard);
      });
    }
  }

  recargarPlan(idPlan: number) {
    const path = Cons.PATH_PLAN_TRABAJO_ID;
    this.appService.getRequest(`${path}/${idPlan}`).subscribe(res => {
      this.setProperties(res.body as PlanTrabajoBoard);
      this.tiempoService.fetchTiempos(idPlan, true);
    });
  }

  setProperties(plan: PlanTrabajoBoard) {
    if (plan) {
      this.uiService.showSnackBar('Se ha seleccionado plan correctamente', 2);
      this.planActual = plan;
      this.planActualSubject.next(this.planActual);
      if (!plan.aprobado) {
        this.uiService.showConfirm({
          title: 'Plan no aprobado', confirm: 'Ok',
          message: 'El plan de trabajo "' + plan.planDeTrabajo.nombrePlan + '" no ha sido aprobado aún.'
        });
      }
    } else {
      this.uiService.showSnackBar('No se ha podido seleccionar plan, intenta nuevamente', 3);
    }
  }

  fetchPlanActual() {
    if (this.planActual && this.planActual.idPlanDeTrabajo) {
      this.planActualSubject.next(this.planActual);
    }
  }


  /*  FIN ACTUALIZACION DE OBSERVABLES  */

  /**
   *  METODOS PARA PLANES DE TRABAJO
   */

  crearPlan(data: any, proyecto: number) {
    const path = this.planTrabajoPath.replace('{idProyecto}', proyecto.toString());
    this.uiService.putSnackBar(this.appService.postRequest(path, data)).subscribe(exito => {
      if (exito) { this.returnToDashboard(); }
    });
  }

  crearPlanDesdeTemplate(data: any, proyecto: number, plantilla: number) {
    const path = this.planTrabajoPath.replace('{idProyecto}', proyecto.toString());
    this.uiService.putSnackBar(this.appService.postRequest(`${path}?plantilla=${plantilla}`, data)).subscribe(exito => {
      if (exito) { this.returnToDashboard(); }
    });
  }

  editarPlan(data: any, idPlan: number) {
    const path = Cons.PATH_PLAN_TRABAJO_ID;
    this.uiService.putSnackBar(this.appService.patchRequest(`${path}/${idPlan}`, data)).subscribe(exito => {
      if (exito) { this.returnToDashboard(); }
    });
  }

  cerrarPlan(idPlan: number, cierre: Cierre): Observable<Cierre> {
    const path = Cons.PATH_CIERRE_PLAN + `/${idPlan}`;
    this.uiService.loadingState.next(true);
    return new Observable(result => {
      this.appService.postRequest(path, cierre).then(res => {
        this.uiService.showSnackBar(res.message, 4);
        this.uiService.loadingState.next(false);
        result.next(res.body);
      }).catch(err => {
        const message = err.error ? err.error.message : 'Ha ocurrido un error interno';
        const errors: string[] = err.error && err.error.errors ? err.error.errors : [];
        this.uiService.showConfirm({ title: 'Error', message, errors, confirm: 'Ok' });
        this.uiService.loadingState.next(false);
      });
    });
  }

  /**
   *  METODOS PARA ETAPAS
   */

  crearEtapa(data: EtapaPlan, plan: number) {
    const path = this.etapasPath.replace('{idPlan}', plan.toString());
    this.uiService.loadingState.next(true);
    this.appService.postRequest(path, data).then(res => {
      this.uiService.loadingState.next(false);
      this.uiService.showSnackBar('Etapa agregada con éxito', 3);
      this.recargarPlan(plan);
    }).catch(err => {
      this.uiService.loadingState.next(false);
      if (err.error && err.status !== 403) {
        const errors: string[] = err.error.errors;
        this.uiService.showConfirm({ title: 'Error', message: err.error.message, errors, confirm: 'Ok' });
      } else if (err.status !== 403) {
        this.uiService.showConfirm({ title: 'Error', message: 'No se ha podido crear etapa', confirm: 'Ok' });
      }
    });
  }

  changeEtapaActual(idPlan: number, etapaActual: number) {
    const path = this.etapasPath.replace('{idPlan}', idPlan.toString());
    this.uiService.putSnackBar(this.appService.postRequest(`${path}/${etapaActual}`, {})).subscribe(exito => {
      if (exito) { this.recargarPlan(idPlan); }
    });
  }

  editEtapa(idPlan: number, etapa: EtapaPlan) {
    const path = this.etapasPath.replace('{idPlan}', idPlan.toString());
    return this.uiService.putSnackBar(this.appService.patchRequest(`${path}/${etapa.idEtapaPDT}`, etapa));
  }

  deleteEtapa(idEtapa: number) {
    const path = this.etapasPath.replace('{idPlan}', this.planActual.idPlanDeTrabajo.toString());
    const data = {
      title: 'Estás seguro de eliminar la Etapa?',
      message: 'Esta acción es irreversible. \n¿Estás seguro?',
      confirm: 'Sí, Eliminar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uiService.putSnackBar(this.appService.deleteRequest(`${path}/${idEtapa}`))
          .subscribe(exito => {
            if (exito) {
              this.planActual.planDeTrabajo.etapas = this.planActual.planDeTrabajo.etapas.filter(etapa => etapa.idEtapaPDT !== idEtapa);
              this.planActual.etapas = this.planActual.etapas.filter(etapa => etapa.etapa.idEtapaPDT !== idEtapa);
              this.fetchPlanActual();
            }
          });
      }
    });
  }

  cerrarEtapa(idEtapa: number, cierre: Cierre): Observable<Cierre> {
    const path = Cons.PATH_CIERRE_ETAPA + `/${idEtapa}`;
    this.uiService.loadingState.next(true);
    return new Observable(result => {
      this.appService.postRequest(path, cierre).then(res => {
        this.uiService.showSnackBar(res.message, 4);
        this.uiService.loadingState.next(false);
        result.next(res.body);
      }).catch(err => {
        const message = err.error ? err.error.message : 'Ha ocurrido un error interno';
        const errors: string[] = err.error && err.error.errors ? err.error.errors : [];
        this.uiService.showConfirm({ title: 'Error', message, errors, confirm: 'Ok' });
        this.uiService.loadingState.next(false);
      });
    });
  }

  /**
   *  METODOS PARA ACTIVIDADES
   */
  createActividad(plan: number, actividad: ActividadDto) {
    const path = this.actividadPath.replace('{idPlan}', plan.toString());
    return this.uiService.putSnackBar(this.appService.postRequest(path, actividad));
  }

  editActividad(plan: number, actividad: ActividadDto) {
    const path = this.actividadPath.replace('{idPlan}', plan.toString());
    return this.uiService.putSnackBar(this.appService.patchRequest(`${path}/${actividad.idActividad}`, actividad));
  }

  changeEstado(actividad: Actividad, nuevoEstado: number) {
    const plan = this.planActual.idPlanDeTrabajo;
    const path = Cons.PATH_ACTIVIDADES;
    return this.appService
      .patchRequest(`${path}/${actividad.idActividad}?plan=${plan}&aprobar=${false}&nuevo-estado=${nuevoEstado}`, actividad);
  }

  solicitarAprobacion(actividad: Actividad) {
    const plan = this.planActual.idPlanDeTrabajo;
    const path = Cons.PATH_ACTIVIDADES;
    const data = { title: 'Solicitar aprobación', message: '¿Deseas solicitar aprobación para esta actividad?', confirm: 'Sí' };
    this.uiService.showConfirm(data).afterClosed().subscribe(res => {
      if (res) {
        this.uiService.putSnackBar(this.appService
          .patchRequest(`${path}/${actividad.idActividad}?plan=${plan}&aprobar=${true}&nuevo-estado=0`, actividad)).subscribe();
      }
    });
  }

  deleteActividad(idActividad: number) {
    return new Observable(observer => {
      const path = this.actividadPath.replace('{idPlan}', this.planActual.idPlanDeTrabajo.toString());
      const data = {
        title: 'Estás seguro de eliminar la Actividad?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.uiService.putSnackBar(this.appService.deleteRequest(`${path}/${idActividad}`))
            .subscribe(exito => {
              if (exito) {
                // this.fetchPlanActual(); TODO: VERIFICAR SI SE DEBE RECARGAR EL PLAN COMPLETO
                observer.next(true);
              } else {
                observer.error();
              }
            });
        } else {
          observer.complete();
        }
      });
    });
  }

  /**
   * METODOS PARA SEGUIMIENTOS
   */
  fetchSeguimientos(idActividad: number) {
    const path = this.seguimientoPath.replace('{idActividad}', idActividad.toString());
    return this.appService.getRequest(path);
  }

  crearSeguimiento(idActividad: number, data: Seguimiento) {
    const path = this.seguimientoPath.replace('{idActividad}', idActividad.toString());
    return this.uiService.putSnackBar(this.appService.postRequest(path, data));
  }

  editarSeguimiento(idActividad: number, data: Seguimiento) {
    const path = this.seguimientoPath.replace('{idActividad}', idActividad.toString());
    return this.uiService.putSnackBar(this.appService.patchRequest(`${path}/${data.idSeguimiento}`, data));
  }

  deleteSeguimiento(idActividad: number, idSeguimiento: number) {
    const path = this.seguimientoPath.replace('{idActividad}', idActividad.toString());
    return this.uiService.putSnackBar(this.appService.deleteRequest(`${path}/${idSeguimiento}`));
  }


  fetchAprobacion(idPlan: number) {
    const path = Cons.PATH_APROBACIONES.replace('{idPlan}', idPlan.toString());
    return this.appService.getRequest(path);
  }

  saveAprobacion(aprobacion: AprobacionPlan, idPlan: number, isUpdate: boolean, idAprobacion: number = null) {
    const path = Cons.PATH_APROBACIONES.replace('{idPlan}', idPlan.toString());
    aprobacion.avalCliente = aprobacion.avalCliente ? aprobacion.avalCliente : false;
    if (isUpdate && idAprobacion) {
      return this.uiService.putSnackBar(this.appService.patchRequest(`${path}/${idAprobacion}`, aprobacion));
    } else {
      return this.uiService.putSnackBar(this.appService.postRequest(path, aprobacion));
    }
  }

  cargarArchivo(archivo: File, idPlan: number, idRegistro: number) {
    const path = Cons.PATH_APROBACIONES.replace('{idPlan}', idPlan.toString());
    return this.uiService.putSnackBar(this.appService.uploadFile(archivo, path, idRegistro).toPromise());
  }

  returnToDashboard() {
    if (this.dashboardService && this.dashboardService.dashboard) {
      const id = this.dashboardService.dashboard.idDashboard;
      this.router.navigate(['proyectos/' + id]);
    } else {
      this.dashboardService.returnToList();
    }
  }

  showSeleccionarEtapaAlert() {
    const message = 'Debes seleccionar un plan de trabajo antes de ingresar aquí';
    this.uiService.showConfirm({ title: 'Selecciona un plan', message, confirm: 'Ok' });
  }

}
