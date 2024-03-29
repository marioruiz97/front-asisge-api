import { NgModule } from '@angular/core';
import { TipoDocumentoListComponent } from './tipo-documento/tipo-documento-list/tipo-documento-list.component';
import { TipoDocumentoFormComponent } from './tipo-documento/tipo-documento-form/tipo-documento-form.component';
import { TipoDocumentoService } from './tipo-documento/tipo-documento.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { EstadoProyectoPageComponent } from './estados-proyectos/estado-proyecto-page/estado-proyecto-page.component';
import { EstadoProyectoListComponent } from './estados-proyectos/estado-proyecto-list/estado-proyecto-list.component';
import { EstadoProyectoFormComponent } from './estados-proyectos/estado-proyecto-form/estado-proyecto-form.component';
import { EstadoProyectoService } from './estados-proyectos/estado-proyecto.service';
import { MaestrosListComponent } from './maestros-list/maestros-list.component';
import { TipoDocumentoPageComponent } from './tipo-documento/tipo-documento-page/tipo-documento-page.component';
import { AuditPageComponent } from './audit/audit-page/audit-page.component';
import { AuditListComponent } from './audit/audit-list/audit-list.component';
import { AuditsService } from './audit/audits.service';
import { EstadoActividadListComponent } from './estados-actividad/estado-actividad-list/estado-actividad-list.component';
import { EstadoActividadFormComponent } from './estados-actividad/estado-actividad-form/estado-actividad-form.component';
import { EstadoActividadService } from './estados-actividad/estado-actividad.service';
import { EstadoActividadPageComponent } from './estados-actividad/estado-actividad-page/estado-actividad-page.component';



@NgModule({
  declarations: [
    TipoDocumentoListComponent,
    TipoDocumentoFormComponent,
    TipoDocumentoPageComponent,
    EstadoProyectoPageComponent,
    EstadoProyectoListComponent,
    EstadoProyectoFormComponent,
    MaestrosListComponent,
    AuditPageComponent,
    AuditListComponent,
    EstadoActividadListComponent,
    EstadoActividadFormComponent,
    EstadoActividadPageComponent,
  ],
  imports: [
    SharedModule
  ],
  providers: [
    TipoDocumentoService, EstadoProyectoService, EstadoActividadService, AuditsService
  ]
})
export class MaestrosModule { }
