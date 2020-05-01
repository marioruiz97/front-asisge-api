import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProyectoListComponent } from './proyecto-list/proyecto-list.component';
import { ProyectoService } from './proyecto.service';
import { FilterComponent } from './proyecto-list/filter/filter.component';
import { ProyectoFormComponent } from './proyecto-form/proyecto-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanTrabajoComponent } from './plan-trabajo/plan-trabajo.component';
import { EstadosComponent } from './dashboard/estados/estados.component';
import { MiembrosComponent } from './dashboard/miembros/miembros.component';
import { UltimasActividadesComponent } from './dashboard/ultimas-actividades/ultimas-actividades.component';
import { ProximasActividadesComponent } from './dashboard/proximas-actividades/proximas-actividades.component';
import { DashboardService } from './dashboard/dashboard.service';
import { PlanTrabajoService } from './plan-trabajo/plan-trabajo.service';
import { AgregarMiembroComponent } from './plan-trabajo/agregar-miembro/agregar-miembro.component';
import { PlanFormComponent } from './plan-trabajo/plan-form/plan-form.component';
import { AgregarEtapasComponent } from './plan-trabajo/agregar-etapas/agregar-etapas.component';
import { EtapasPlanComponent } from './plan-trabajo/etapas-plan/etapas-plan.component';



@NgModule({
  declarations: [
    ProyectoListComponent,
    FilterComponent,
    ProyectoFormComponent,
    DashboardComponent,
    PlanTrabajoComponent,
    EstadosComponent,
    MiembrosComponent,
    UltimasActividadesComponent,
    ProximasActividadesComponent,
    AgregarMiembroComponent,
    PlanFormComponent,
    AgregarEtapasComponent,
    EtapasPlanComponent
  ],
  imports: [
    SharedModule
  ],
  entryComponents: [AgregarMiembroComponent, AgregarEtapasComponent],
  providers: [ProyectoService, DashboardService, PlanTrabajoService]
})
export class ProyectosModule { }
