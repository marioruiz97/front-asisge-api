import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClienteListComponent } from './clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ClienteService } from './clientes/cliente.service';



@NgModule({
  declarations: [ClienteListComponent, ClienteFormComponent],
  imports: [
    SharedModule
  ],
  providers: [ClienteService]
})
export class TercerosModule { }
