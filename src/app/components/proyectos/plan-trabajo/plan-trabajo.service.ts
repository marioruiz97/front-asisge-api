import { Injectable } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { AppService } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';

@Injectable()
export class PlanTrabajoService {


  constructor(
    private dashboardService: DashboardService, private appService: AppService, private uiService: UiService
  ) { }

  fetchPlanDeTrabajo() {
    if (this.dashboardService.dashboard && this.dashboardService.dashboard.idDashboard) {
      // request para obtener la info del plan
    } else {
      const message = 'No se ha podido obtener plan de trabajo, intenta nuevamente';
      this.uiService.showConfirm({ title: 'Error al obtener información', message, confirm: 'Sí, intentar nuevamente' })
        .afterClosed().subscribe(result => {
          if (result) {
            this.fetchPlanDeTrabajo();
          }
        });
    }
  }
}
