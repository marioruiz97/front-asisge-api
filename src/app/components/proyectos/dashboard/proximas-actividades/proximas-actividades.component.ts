import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-proximas-actividades',
  templateUrl: './proximas-actividades.component.html',
  styleUrls: ['./proximas-actividades.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProximasActividadesComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription[] = [];
  displayedColumns = ['idActividad', 'nombre', 'etapa', 'fechaVencimiento', 'estado', 'duracion'];
  datasource = new MatTableDataSource<Actividad>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.subs.push(this.dashboardService.proximasActividades.subscribe(list => this.datasource.data = list));
    this.dashboardService.fetchProximasActividades();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  getVencida(actividad: Actividad) {
    const date = new Date();
    console.log('today get time', date.getTime())
    console.log('fecha vencimiento', actividad.fechaVencimiento)
    /* return date.getTime() > actividad.fechaVencimiento.getTime() ? 'Vencida' : 'Por vencer'; */
    return 'por vencer'
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
