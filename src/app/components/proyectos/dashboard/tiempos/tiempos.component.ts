import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Tiempo } from 'src/app/models/proyectos/actividad.model';
import { TiempoService } from './tiempo.service';
import { PlanTrabajoService } from '../../plan-trabajo/plan-trabajo.service';
import { DashboardService } from '../dashboard.service';

export interface FiltroTiempo {
  usuario: number;
  fechaDesde: Date;
  fechaHasta: Date;
}

@Component({
  selector: 'app-tiempos',
  templateUrl: './tiempos.component.html',
  styleUrls: ['./tiempos.component.css']
})
export class TiemposComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription[] = [];
  displayedColumns = ['usuario', 'actividad', 'fechaVencimiento', 'duracion', 'horasTrabajadas'];
  datasource = new MatTableDataSource<Tiempo>();

  miembrosProyecto: Usuario[] = [];
  filterForm: FormGroup;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: TiempoService, private planService: PlanTrabajoService, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.initForm();
    this.setSortingAccesor();
    this.subs.push(this.dashboardService.miembros.subscribe(miembros => this.miembrosProyecto = miembros.map(miembro => miembro.usuario)));
    this.subs.push(this.planService.planActualSubject.subscribe(plan => {
      this.subs.push(this.service.fetchTiempos(plan.idPlanDeTrabajo).subscribe(res => {
        const list: Tiempo[] = res.body as Tiempo[];
        list.forEach(registro => registro.horasTrabajadas = registro.seguimientos
          .reduce((total, seg) => total += seg.horasTrabajadas, 0));
        this.datasource.data = list;
        this.datasource.filterPredicate = this.createFilter();
      }));
    }));
    this.dashboardService.fetchMiembros();
  }

  private initForm() {
    this.filterForm = new FormGroup({
      usuario: new FormControl(''),
      fechaDesde: new FormControl(''),
      fechaHasta: new FormControl('')
    });
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  private setSortingAccesor() {
    this.datasource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'usuario': return item.usuario.idUsuario;
        case 'actividad': return item.actividad.nombre;
        case 'fechaVencimiento': return new Date(item.actividad.fechaVencimiento);
        case 'duracion': return item.actividad.duracion;
        default: return item[property];
      }
    };
  }

  private createFilter(): (data: Tiempo, filter: string) => boolean {
    const filterFunction = (data: Tiempo, filter: string): boolean => {
      const filtro = JSON.parse(filter) as FiltroTiempo;
      const desde = !filtro.fechaDesde || (filtro.fechaDesde
        && data.seguimientos.filter(seg => new Date(seg.createdDate).getTime() > new Date(filtro.fechaDesde).getTime()).length > 0);
      const hasta = !filtro.fechaHasta || (filtro.fechaHasta
        && data.seguimientos.filter(seg => new Date(seg.createdDate).getTime() < new Date(filtro.fechaHasta).getTime()).length > 0);
      const filtroUsuario = !filtro.usuario || (filtro.usuario
        && data.actividad.responsables.map(user => user.idUsuario).includes(filtro.usuario));
      return desde && hasta && filtroUsuario;
    };
    return filterFunction;
  }

  doFilter() {
    const filtro: FiltroTiempo = this.filterForm.value;
    /* this.quitarFiltros = true; */
    this.datasource.filter = JSON.stringify(filtro);
  }

  removeFilter() {
    const filtro: FiltroTiempo = {
      fechaDesde: null, fechaHasta: null, usuario: null
    };
    /* this.quitarFiltros = false; */
    this.initForm();
    this.datasource.filter = JSON.stringify(filtro);
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
