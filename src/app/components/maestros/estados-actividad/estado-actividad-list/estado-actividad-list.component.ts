import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EstadoActividad } from 'src/app/models/proyectos/estado-actividad.model';
import { EstadoActividadService } from '../estado-actividad.service';

@Component({
  selector: 'app-estado-actividad-list',
  templateUrl: './estado-actividad-list.component.html',
  styleUrls: ['../../maestros.css']
})
export class EstadoActividadListComponent implements OnInit, AfterViewInit, OnDestroy {

  private listSub: Subscription[] = [];
  displayedColumns = ['idEstado', 'nombreEstado', 'descripcion', 'estadoInicial', 'actividadNoAprobada', 'actividadCompletada', 'acciones'];
  datasource = new MatTableDataSource<EstadoActividad>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: EstadoActividadService) { }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetch() {
    this.listSub.push(
      this.service.fetchAllEstados().subscribe(list => this.datasource.data = list.body as EstadoActividad[],
        err => this.service.showNotFound(err)
      ));
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  delete(id: number) {
    this.listSub.push(this.service.delete(id).subscribe(res => {
      if (res) { this.fetch(); }
    }));
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.forEach(sub => sub.unsubscribe()); }
  }

}
