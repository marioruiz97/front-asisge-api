import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EstadoProyecto } from 'src/app/models/proyectos/proyecto.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EstadoProyectoService } from '../estado-proyecto.service';

@Component({
  selector: 'app-estado-proyecto-list',
  templateUrl: './estado-proyecto-list.component.html',
  styleUrls: ['../../maestros.css']
})
export class EstadoProyectoListComponent implements OnInit, AfterViewInit, OnDestroy {

  private listSub: Subscription[] = [];
  displayedColumns = ['id', 'nombreEstado', 'descripcion', 'idEstadoAnterior', 'acciones'];
  datasource = new MatTableDataSource<EstadoProyecto>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: EstadoProyectoService) { }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetch() {
    this.listSub.push(
      this.service.fetchAll().subscribe(list => this.datasource.data = list.body as EstadoProyecto[],
        err => this.service.showNotFound(err)
      ));
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
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
