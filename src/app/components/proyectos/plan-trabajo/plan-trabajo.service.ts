import { Injectable } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppService } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { Subject, Observable } from 'rxjs';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { Router } from '@angular/router';
import { ActividadDto, Seguimiento } from 'src/app/models/proyectos/actividad.model';
import { PlanTrabajoBoard } from 'src/app/models/proyectos/plan-trabajo-board.model';

@Injectable()
export class PlanTrabajoService {

  private idProyecto: number;

  planActual: PlanTrabajoBoard;
  planActualSubject = new Subject<PlanTrabajoBoard>();

  private planTrabajoPath = Cons.PATH_PLANES_TRABAJO;
  private etapasPath = Cons.PATH_ETAPA_PLAN;
  private actividadPath = Cons.PATH_ACTIVIDADES_PLAN;
  private seguimientoPath = Cons.SEGUIMIENTOS;

  constructor(
    private dashboardService: DashboardService, private appService: AppService,
    private uiService: UiService, private router: Router
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
    });
  }

  setProperties(plan: PlanTrabajoBoard) {
    if (plan) {
      this.uiService.showSnackBar('Se ha seleccionado plan correctamente', 2);
      this.planActual = plan;
      this.planActualSubject.next(this.planActual);
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
