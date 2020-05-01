import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-proximas-actividades',
  templateUrl: './proximas-actividades.component.html',
  styleUrls: ['./proximas-actividades.component.css']
})
export class ProximasActividadesComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription[] = [];
  displayedColumns = ['emailUsuario', 'accionRealizada', 'descripcionAccion', 'fechaAccion'];
  datasource = new MatTableDataSource<any>(); // TODO: cambiar any por actividad

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor() { }

  ngOnInit() {
  }

  // TODO: implementar fetch

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
