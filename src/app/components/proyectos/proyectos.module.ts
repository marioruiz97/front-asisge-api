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
import { PlanDesdePlantillaComponent } from './plan-trabajo/plan-desde-plantilla/plan-desde-plantilla.component';
import { EditarEtapaComponent } from './plan-trabajo/editar-etapa/editar-etapa.component';
import { ModalActividadComponent } from './plan-trabajo/modal-actividad/modal-actividad.component';
import { ActividadesPlanComponent } from './plan-trabajo/actividades-plan/actividades-plan.component';
import { DetalleActividadComponent } from './plan-trabajo/detalle-actividad/detalle-actividad.component';
import { SeguimientoListComponent } from './plan-trabajo/seguimiento-list/seguimiento-list.component';
import { SeguimientoFormComponent } from './plan-trabajo/seguimiento-form/seguimiento-form.component';
import { PasarActividadEstadoComponent } from './plan-trabajo/pasar-actividad-estado/pasar-actividad-estado.component';
import { TiemposComponent } from './dashboard/tiempos/tiempos.component';
import { TiempoService } from './dashboard/tiempos/tiempo.service';
import { EstadoProyectoComponent } from './estado-proyecto/estado-proyecto.component';
import { AprobacionPlanComponent } from './plan-trabajo/aprobacion-plan/aprobacion-plan.component';
import { ArchivosProyectoComponent } from './archivos-proyecto/archivos-proyecto.component';
import { CierresComponent } from './plan-trabajo/cierres/cierres.component';



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
    EtapasPlanComponent,
    PlanDesdePlantillaComponent,
    EditarEtapaComponent,
    ModalActividadComponent,
    ActividadesPlanComponent,
    DetalleActividadComponent,
    SeguimientoListComponent,
    SeguimientoFormComponent,
    PasarActividadEstadoComponent,
    TiemposComponent,
    EstadoProyectoComponent,
    AprobacionPlanComponent,
    ArchivosProyectoComponent,
    CierresComponent
  ],
  imports: [
    SharedModule
  ],
  entryComponents: [
    AgregarMiembroComponent,
    AgregarEtapasComponent,
    EditarEtapaComponent,
    ModalActividadComponent,
    DetalleActividadComponent,
    PasarActividadEstadoComponent,
    EstadoProyectoComponent,
    AprobacionPlanComponent,
    ArchivosProyectoComponent,
    CierresComponent
  ],
  providers: [ProyectoService, DashboardService, PlanTrabajoService, TiempoService]
})
export class ProyectosModule { }
