import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { DashboardService } from '../dashboard.service';
import { UiService } from 'src/app/shared/ui.service';

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


  constructor(private dashboardService: DashboardService, private uiService: UiService) { }

  ngOnInit() {
    this.setSortingAccesor();
    this.subs.push(this.dashboardService.proximasActividades.subscribe(list => {
      this.datasource.data = list;
      const date = new Date();
      if (this.datasource.data.filter(actividad => date.getTime() > new Date(actividad.fechaVencimiento).getTime()).length > 0) {
        const message = 'Hay actividades cuyas fechas de vencimiento ya han pasado';
        this.dashboardService.alertarProyecto(message, true);
      } else {
        this.dashboardService.alertarProyecto('');
      }
    }));
    this.dashboardService.fetchProximasActividades();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  private setSortingAccesor() {
    this.datasource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'etapa': return item.etapa.nombreEtapa;
        case 'estado': return this.getVencida(item);
        default: return item[property];
      }
    };
  }

  getVencida(actividad: Actividad) {
    const date = new Date();
    return date.getTime() > new Date(actividad.fechaVencimiento).getTime() ? 'Vencida' : 'Por vencer';
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
