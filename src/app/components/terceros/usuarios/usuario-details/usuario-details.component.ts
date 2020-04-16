import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
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
  private subs: Subscription[] = [];
  clientes: Cliente[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private service: UsuarioService,
    private dialogRef: MatDialogRef<UsuarioDetailsComponent>
  ) {
    const doc = data.tipoDocumento as TipoDocumento;
    this.info.push({ property: 'Id usuario:', data: data.idUsuario });
    this.info.push({ property: 'Tipo de documento:', data: doc.nombreTipoDocumento });
    this.info.push({ property: 'Identificación:', data: data.identificacion });
    this.info.push({ property: 'Nombre:', data: data.nombre });
    this.info.push({ property: 'Apellidos:', data: `${data.apellido1} ${data.apellido2}` });
    this.info.push({ property: 'Teléfono:', data: data.telefono ? data.telefono : 'No hay teléfono asociado' });
    this.info.push({ property: 'Correo:', data: data.correo });
    this.info.push({ property: 'Estado:', data: data.estado ? 'Activo' : 'Inactivo' });
    this.info.push({ property: 'Rol(es):', data: data.roles.map(rol => rol.nombreRole.replace('ROLE_', ' ')) });
  }

  ngOnInit() {
    this.subs.push(this.service.fetchClientes(this.data.idUsuario).subscribe(res => this.clientes = res.body as Cliente[]));
  }

  cambiarEstado() {
    this.subs.push(this.service.changeEstado(this.data.idUsuario, this.data.estado).subscribe(res => {
      if (res) { this.closeModal(true); }
    }));
  }

  closeModal(res: boolean = false) {
    if (res) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
