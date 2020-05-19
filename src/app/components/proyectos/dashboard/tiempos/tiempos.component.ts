import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Tiempo } from 'src/app/models/proyectos/actividad.model';
import { TiempoService } from './tiempo.service';
import { PlanTrabajoService } from '../../plan-trabajo/plan-trabajo.service';
import { DashboardService } from '../dashboard.service';

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
    this.subs.push(this.dashboardService.miembros.subscribe(miembros => this.miembrosProyecto = miembros.map(miembro => miembro.usuario)));
    this.subs.push(this.planService.planActualSubject.subscribe(plan => {
      this.subs.push(this.service.fetchTiempos(plan.idPlanDeTrabajo).subscribe(res => {
        const list: Tiempo[] = res.body as Tiempo[];
        list.forEach(registro => registro.horasTrabajadas = registro.seguimientos
          .reduce((total, seg) => total += seg.horasTrabajadas, 0));
        console.log('list', list)
        this.datasource.data = list;
        console.log('datasource', this.datasource.data)
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

  doFilter() {
    /* const filtro: FiltroActividad = this.filterForm.value;
    this.quitarFiltros = true;
    this.datasource.filter = JSON.stringify(filtro); */
  }

  removeFilter() {
    /* const filtro: FiltroActividad = {
      nombre: '', etapa: null, fechaVencimiento: null, usuario: null
    };
    this.quitarFiltros = false;
    this.initForm();
    this.datasource.filter = JSON.stringify(filtro); */
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
