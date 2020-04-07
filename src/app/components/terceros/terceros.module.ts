import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClienteListComponent } from './clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './clientes/cliente-form/cliente-form.component';
import { ClienteService } from './clientes/cliente.service';
import { ContactoFormComponent } from './clientes/contacto-form/contacto-form.component';
import { ContactoListComponent } from './clientes/contacto-list/contacto-list.component';
import { UsuarioListComponent } from './usuarios/usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './usuarios/usuario-form/usuario-form.component';
import { UsuarioService } from './usuarios/usuario.service';
import { UsuarioDetailsComponent } from './usuarios/usuario-details/usuario-details.component';
import { UsuarioClientesComponent } from './usuarios/usuario-clientes/usuario-clientes.component';
import { AsesorClienteComponent } from './clientes/asesor-cliente/asesor-cliente.component';



@NgModule({
  declarations: [
    ClienteListComponent, ClienteFormComponent,
    ContactoFormComponent, ContactoListComponent,
    UsuarioListComponent, UsuarioFormComponent,
    UsuarioDetailsComponent, UsuarioClientesComponent, AsesorClienteComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [ClienteService, UsuarioService],
  entryComponents: [ContactoFormComponent, UsuarioDetailsComponent, UsuarioClientesComponent, AsesorClienteComponent]
})
export class TercerosModule { }
