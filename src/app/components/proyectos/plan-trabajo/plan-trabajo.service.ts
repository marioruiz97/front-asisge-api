import { Injectable } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppService } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajo, EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { Subject } from 'rxjs';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { Router } from '@angular/router';

@Injectable()
export class PlanTrabajoService {

  planActual: PlanTrabajo;
  etapasSubject = new Subject<EtapaPlan[]>();
  planActualSubject = new Subject<PlanTrabajo>();
  planesSubject = new Subject<PlanTrabajo[]>();

  private planTrabajoPath = Cons.PATH_PLANES_TRABAJO;

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
      this.planActualSubject.next(this.planActual);
    } else {
      const path = Cons.PATH_PLAN_TRABAJO_ID;
      this.appService.getRequest(`${path}/${id}`).subscribe(res => {
        this.planActual = res.body as PlanTrabajo;
        this.planActualSubject.next(this.planActual);
      });
    }
  }

  crearPlan(data: any, proyecto: number) {
    const path = this.planTrabajoPath.replace('{idProyecto}', proyecto.toString());
    this.uiService.putSnackBar(this.appService.postRequest(path, data)).subscribe(exito => {
      if (exito) { this.returnToDashboard(); }
    });
  }

  returnToDashboard() {
    if (this.dashboardService && this.dashboardService.dashboard) {
      const id = this.dashboardService.dashboard.idDashboard;
      this.router.navigate(['proyectos/' + id]);
    }
  }

}
