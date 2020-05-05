import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { UsuarioService } from '../usuario.service';
import { UsuarioDetailsComponent } from '../usuario-details/usuario-details.component';
import { UsuarioClientesComponent } from '../usuario-clientes/usuario-clientes.component';
import { BASIC_DIALOG_CONFIG } from 'src/app/shared/routing/app.constants';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit, OnDestroy, AfterViewInit {

  private listSub: Subscription[] = [];

  displayedColumns = ['idUsuario', 'identificacion', 'nombre', 'apellido1', 'correo', 'estado', 'acciones'];
  datasource = new MatTableDataSource<Usuario>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private service: UsuarioService, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetch() {
    this.listSub.push(this.service.fetchAll().subscribe(list => this.datasource.data = list.body as Usuario[],
      err => this.service.showNotFound(err)
    ));
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  showDetails(usuario: Usuario) {
    if (usuario.apellido2 && usuario.apellido2 === '') { usuario.apellido2 = ''; }
    const ref = this.dialog.open(UsuarioDetailsComponent, { ...BASIC_DIALOG_CONFIG, data: usuario });
    this.listSub.push(ref.afterClosed().subscribe(res => { if (res) { this.fetch(); } }));
  }

  showClientes(usuario: Usuario) {
    if (usuario.apellido2 && usuario.apellido2 === '') { usuario.apellido2 = ''; }
    this.dialog.open(UsuarioClientesComponent, { ...BASIC_DIALOG_CONFIG, data: usuario });
  }

  delete(id: string) {
    this.listSub.push(this.service.delete(id).subscribe(res => {
      if (res) { this.fetch(); }
    }));
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.forEach(sub => sub.unsubscribe()); }
  }


}
