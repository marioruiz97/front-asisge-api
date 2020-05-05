import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlantillaFormComponent } from 'src/app/components/plantillas/plantilla-form/plantilla-form.component';
import { PlantillaListComponent } from 'src/app/components/plantillas/plantilla-list/plantilla-list.component';
import { EtapaFormComponent } from 'src/app/components/plantillas/etapa-form/etapa-form.component';
import { PlantillaService } from './plantilla.service';
import { ActividadFormComponent } from './actividad-form/actividad-form.component';
import { ActividadListComponent } from './actividad-list/actividad-list.component';


@NgModule({
  declarations: [PlantillaListComponent, PlantillaFormComponent, EtapaFormComponent, ActividadFormComponent, ActividadListComponent],
  imports: [
    SharedModule
  ],
  providers: [PlantillaService],
  entryComponents: [EtapaFormComponent, ActividadFormComponent]
})
export class PlantillaModule { }
