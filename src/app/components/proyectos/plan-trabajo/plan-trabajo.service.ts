import { Injectable } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppService } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajo, EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { Subject, Observable } from 'rxjs';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { Router } from '@angular/router';

@Injectable()
export class PlanTrabajoService {

  planActual: PlanTrabajo;
  etapasSubject = new Subject<EtapaPlan[]>();
  planActualSubject = new Subject<PlanTrabajo>();
  planesSubject = new Subject<PlanTrabajo[]>();

  private planTrabajoPath = Cons.PATH_PLANES_TRABAJO;
  private etapasPath = Cons.PATH_ETAPA_PLAN;

  constructor(
    private dashboardService: DashboardService, private appService: AppService,
    private uiService: UiService, private router: Router
  ) { }

  fetchPlanesDeTrabajo(idProyecto: number) {
    const path = this.planTrabajoPath.replace('{idProyecto}', idProyecto.toString());
    this.appService.getRequest(path).subscribe(res => {
      this.planesSubject.next(res.body);
    }/* , err => {
      const message = 'No se han obtenido planes de trabajo, intenta nuevamente';
      this.uiService.showConfirm({ title: 'Error al obtener información', message, confirm: 'Sí, intentar nuevamente' })
        .afterClosed().subscribe(result => {
          if (result) {
            this.fetchPlanesDeTrabajo(idProyecto);
          }
        });
    } */);
  }


  selectActual(id: number) {
    if (this.planActual && this.planActual.idPlanDeTrabajo && this.planActual.idPlanDeTrabajo === id) {
      this.setProperties(this.planActual);
    } else {
      const path = Cons.PATH_PLAN_TRABAJO_ID;
      this.appService.getRequest(`${path}/${id}`).subscribe(res => {
        this.planActual = res.body as PlanTrabajo;
        this.setProperties(this.planActual);
      });
    }
  }

  setProperties(plan: PlanTrabajo) {
    if (plan) {
      this.uiService.showSnackBar('Se ha seleccionado plan correctamente', 2);
      this.planActual = plan;
      this.planActualSubject.next(this.planActual);
      this.etapasSubject.next(this.planActual.etapas);
    } else {
      this.uiService.showSnackBar('No se ha podido seleccionar plan, intenta nuevamente', 3);
    }
  }

  fetchPlanActual() {
    if (this.planActual && this.planActual.idPlanDeTrabajo) {
      this.planActualSubject.next(this.planActual);
    }
  }

  fetchEtapas() {
    if (this.planActual && this.planActual.etapas) {
      this.etapasSubject.next(this.planActual.etapas);
    }
  }

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

  crearEtapa(data: EtapaPlan, plan: number) {
    const path = this.etapasPath.replace('{idPlan}', plan.toString());
    this.uiService.loadingState.next(true);
    this.appService.postRequest(path, data).then(res => {
      this.uiService.loadingState.next(false);
      this.uiService.showSnackBar('Etapa agregada con éxito', 3);
      if (this.planActual.etapas) {
        this.planActual.etapas.push(res.body as EtapaPlan);
      } else {
        this.planActual.etapas = [res.body as EtapaPlan];
      }
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
    return new Observable(observer => {
      const data = {
        title: 'Estás seguro de eliminar la Etapa?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.uiService.putSnackBar(this.appService.deleteRequest(`${path}/${idEtapa}`))
            .subscribe(exito => observer.next(exito));
        }
      });
    });
  }


  recargarPlan(idPlan: number) {
    const path = Cons.PATH_PLAN_TRABAJO_ID;
    this.appService.getRequest(`${path}/${idPlan}`).subscribe(res => {
      this.planActual = res.body as PlanTrabajo;
      this.setProperties(this.planActual);
    });
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
