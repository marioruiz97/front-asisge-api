import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProyectoListComponent } from './proyecto-list/proyecto-list.component';
import { ProyectoService } from './proyecto.service';
import { FilterComponent } from './proyecto-list/filter/filter.component';



@NgModule({
  declarations: [ProyectoListComponent, FilterComponent],
  imports: [
    SharedModule
  ],
  providers: [ProyectoService]
})
export class ProyectosModule { }
