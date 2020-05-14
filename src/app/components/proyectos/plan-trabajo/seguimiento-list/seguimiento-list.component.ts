import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { Seguimiento, Actividad } from 'src/app/models/proyectos/actividad.model';
import { Usuario } from 'src/app/models/terceros/usuario.model';

@Component({
  selector: 'app-seguimiento-list',
  templateUrl: './seguimiento-list.component.html',
  styleUrls: ['./seguimiento-list.component.css']
})
export class SeguimientoListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['usuarioSeguimiento', 'createdDate', 'horasTrabajadas', 'descripcionLabor'];
  datasource = new MatTableDataSource<Seguimiento>();
  showForm = false;
  idActividad: number;

  private subs: Subscription[] = [];

  @Input() actividad: Actividad;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: PlanTrabajoService) { }

  ngOnInit() {
    this.idActividad = this.actividad.idActividad;
    this.fetchSeguimientos();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetchSeguimientos() {
    this.subs.push(this.service.fetchSeguimientos(this.idActividad).subscribe(res => this.datasource.data = res.body as Seguimiento[]));
  }

  showApproval() {
    this.service.solicitarAprobacion(this.actividad);
  }

  getNombre(usuario: Usuario) {
    return `${usuario.nombre} ${usuario.apellido1}`;
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
