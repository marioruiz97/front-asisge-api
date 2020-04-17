import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProyectoListComponent } from './proyecto-list/proyecto-list.component';
import { ProyectoService } from './proyecto.service';
import { FilterComponent } from './proyecto-list/filter/filter.component';
import { ProyectoFormComponent } from './proyecto-form/proyecto-form.component';



@NgModule({
  declarations: [ProyectoListComponent, FilterComponent, ProyectoFormComponent],
  imports: [
    SharedModule
  ],
  providers: [ProyectoService]
})
export class ProyectosModule { }
