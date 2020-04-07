import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Usuario, UserInfo } from 'src/app/models/terceros/usuario.model';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Subscription, Observable } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ClienteService } from '../../clientes/cliente.service';

@Component({
  templateUrl: './usuario-clientes.component.html',
  styleUrls: ['./usuario-clientes.component.css']
})
export class UsuarioClientesComponent implements OnInit, OnDestroy {

  info: UserInfo[] = [];
  clientes: Cliente[] = [];

  clienteControl = new FormControl();
  allClientes: Cliente[] = [];
  filteredClientes: Observable<Cliente[]>;
  private subs: Subscription[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    public dialogRef: MatDialogRef<UsuarioClientesComponent>,
    private service: UsuarioService,
    private clienteService: ClienteService
  ) {
    this.info.push({ property: 'Id usuario:', data: data.idUsuario });
    this.info.push({ property: 'Identificación:', data: data.identificacion });
    this.info.push({ property: 'Nombre:', data: data.nombre + ' ' + data.apellido1 + ' ' + data.apellido2 });
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.fetchClientes();
    this.filteredClientes = this.clienteControl.valueChanges
      .pipe(
        startWith(''),
        map(fieldValue => fieldValue ? this._filter(fieldValue) : this._returnFilter(this.allClientes))
      );
  }

  fetchClientes() {
    this.subs.push(this.service.fetchClientes(this.data.idUsuario).subscribe(res => {
      this.clientes = res.body as Cliente[];
      this.clientes.forEach(c => c.tipoDocumento = c.tipoDocumento as TipoDocumento);
    }));

    this.subs.push(this.clienteService.fetchAll().subscribe(res => this.allClientes = res.body as Cliente[]));
  }


  private _returnFilter(all: Cliente[]): Cliente[] {
    const oldIs = this.clientes.map(old => old.idCliente);
    const allIds = all
      .map(item => item.idCliente)
      .filter(id => !oldIs.includes(id));
    return all.filter(c => allIds.includes(c.idCliente)).slice();


    /* return all.filter(c => this.clientes.map(old => c.idCliente !== old.idCliente ? c.idCliente : 0).includes(c.idCliente)
    ).slice(); */
  }

  private _filter(value: string): Cliente[] {
    const filterValue = value.trim().toLowerCase();

    const result = this.allClientes.filter(c =>
      c.razonSocial.toLowerCase().includes(filterValue) || c.nombreComercial.toLowerCase().includes(filterValue)
    );
    return this._returnFilter(result);
  }

  onSelected(event: any) {
    const id = event.option._element.nativeElement.children[0].firstChild.id;
    this.addCliente(parseInt(id, 10));
    this.clienteControl.setValue('', { emitEvent: false });
  }

  private addCliente(idCliente: number) {
    const cliente: Cliente = this.allClientes.filter(c => c.idCliente === idCliente)[0];
    this.clientes.push(cliente);
  }

  onRemove(idCliente: number) {
    this.clientes = this.clientes.filter(c => c.idCliente !== idCliente);
  }

  saveClientes() {
    const newClientes = this.clientes.map(cliente => {
      return { usuario: this.data.idUsuario, cliente: cliente.idCliente };
    });
    this.service.saveClientes(this.data.idUsuario, newClientes).subscribe((exito: boolean) => {
      if (exito) { this.dialogRef.close(); }
    });
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
