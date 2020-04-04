import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Contacto } from 'src/app/models/terceros/cliente.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ClienteService } from '../cliente.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacto-list',
  templateUrl: './contacto-list.component.html'
})
export class ContactoListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['nombre', 'telefono', 'correo', 'acciones'];
  datasource = new MatTableDataSource<Contacto>();
  dataSub: Subscription;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Output() eliminar = new EventEmitter<number>();
  @Output() editar = new EventEmitter();
  @Output() refrescar = new EventEmitter();

  constructor(private service: ClienteService) { }

  ngOnInit() {
    this.dataSub = this.service.contactosChanged.subscribe(list => this.datasource.data = list);
    this.refrescar.emit();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  edit(contacto: Contacto) {
    this.editar.emit(contacto);
  }

  delete(id: number) {
    this.eliminar.emit(id);
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

}
