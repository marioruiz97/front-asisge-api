import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Usuario, UserInfo } from 'src/app/models/terceros/usuario.model';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-details',
  templateUrl: './usuario-details.component.html'
})
export class UsuarioDetailsComponent implements OnInit, OnDestroy {

  info: UserInfo[] = [];
  clienteSub: Subscription;
  clientes: Cliente[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Usuario, private service: UsuarioService) {
    const doc = data.tipoDocumento as TipoDocumento;
    this.info.push({ property: 'Id usuario:', data: data.idUsuario });
    this.info.push({ property: 'Tipo de documento:', data: doc.nombreTipoDocumento });
    this.info.push({ property: 'Identificación:', data: data.identificacion });
    this.info.push({ property: 'Nombre:', data: data.nombre });
    this.info.push({ property: 'Apellidos:', data: `${data.apellido1} ${data.apellido2}` });
    this.info.push({ property: 'Teléfono:', data: data.telefono ? data.telefono : 'No hay teléfono asociado' });
    this.info.push({ property: 'Correo:', data: data.correo });
    this.info.push({ property: 'Estado:', data: data.estado ? 'Activo' : 'Inactivo' });
  }

  ngOnInit() {
    this.clienteSub = this.service.fetchClientes(this.data.idUsuario).subscribe(res => this.clientes = res.body as Cliente[]);
  }

  ngOnDestroy() {
    if (this.clienteSub) { this.clienteSub.unsubscribe(); }
  }
}
