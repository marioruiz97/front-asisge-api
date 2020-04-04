import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClienteListComponent } from './clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ClienteService } from './clientes/cliente.service';
import { ContactoFormComponent } from './clientes/contacto-form/contacto-form.component';
import { ContactoListComponent } from './clientes/contacto-list/contacto-list.component';



@NgModule({
  declarations: [ClienteListComponent, ClienteFormComponent, ContactoFormComponent, ContactoListComponent],
  imports: [
    SharedModule
  ],
  providers: [ClienteService],
  entryComponents: [ContactoFormComponent]
})
export class TercerosModule { }
