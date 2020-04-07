import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { UserInfo, Usuario } from 'src/app/models/terceros/usuario.model';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { ClienteService } from '../cliente.service';
import { UsuarioService } from '../../usuarios/usuario.service';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { startWith, map } from 'rxjs/operators';

@Component({
  templateUrl: './asesor-cliente.component.html',
  styleUrls: ['./asesor-cliente.component.css']
})
export class AsesorClienteComponent implements OnInit, OnDestroy {

  info: UserInfo[] = [];
  usuarios: Usuario[] = [];

  userControl = new FormControl();
  allUsuarios: Usuario[] = [];
  filteredUsuarios: Observable<Usuario[]>;
  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    public dialogRef: MatDialogRef<AsesorClienteComponent>,
    private service: ClienteService,
    private userService: UsuarioService
  ) {
    const tipoDoc = data.tipoDocumento as TipoDocumento;
    this.info.push({ property: 'Id cliente:', data: data.idCliente });
    this.info.push({ property: 'Identificación', data: tipoDoc.nombreTipoDocumento + ': ' + data.identificacion });
    this.info.push({ property: 'Razón Social:', data: data.razonSocial });
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.fetchUsuarios();
    this.filteredUsuarios = this.userControl.valueChanges
      .pipe(
        startWith(''),
        map(fieldValue => fieldValue ? this._filter(fieldValue) : this._returnFilter(this.allUsuarios))
      );
  }

  fetchUsuarios() {
    this.subs.push(this.service.fetchUsuarios(this.data.idCliente).subscribe(res => {
      this.usuarios = res.body as Usuario[];
      this.usuarios.forEach(c => c.tipoDocumento = c.tipoDocumento as TipoDocumento);
    }));
    this.subs.push(this.userService.fetchAll().subscribe(res => this.allUsuarios = res.body as Usuario[]));
  }

  private _returnFilter(all: Usuario[]): Usuario[] {
    const oldIs = this.usuarios.map(old => old.idUsuario);
    const remainIds = all
      .map(item => item.idUsuario)
      .filter(id => !oldIs.includes(id));
    return all.filter(c => remainIds.includes(c.idUsuario)).slice();
  }

  private _filter(value: string): Usuario[] {
    const filterValue = value.trim().toLowerCase();
    const result = this.allUsuarios.filter(c =>
      c.nombre.toLowerCase().includes(filterValue)
      || c.apellido1.toLowerCase().includes(filterValue)
      || c.identificacion.toLowerCase().includes(filterValue)
    );
    return this._returnFilter(result);
  }

  onSelected(event: any) {
    const id = event.option._element.nativeElement.children[0].firstChild.id;
    this.addUsuario(parseInt(id, 10));
    this.userControl.setValue('', { emitEvent: false });
  }

  private addUsuario(idUsuario: number) {
    const usuario: Usuario = this.allUsuarios.filter(u => u.idUsuario === idUsuario)[0];
    this.usuarios.push(usuario);
  }

  onRemove(idUsuario: number) {
    this.usuarios = this.usuarios.filter(u => u.idUsuario !== idUsuario);
  }

  saveUsuarios() {
    const newUsuarios = this.usuarios.map(usuario => {
      return { cliente: this.data.idCliente, usuario: usuario.idUsuario };
    });
    this.service.saveUsuarios(this.data.idCliente, newUsuarios).subscribe((exito: boolean) => {
      if (exito) { this.dialogRef.close(); }
    });
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
