import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';

@Component({
  selector: 'app-actividades-plan',
  templateUrl: './actividades-plan.component.html',
  styleUrls: ['./actividades-plan.component.css']
})
export class ActividadesPlanComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription[] = [];
  displayedColumns = ['idActividad', 'nombre', 'etapa', 'fechaVencimiento', 'duracion', 'acciones'];
  datasource = new MatTableDataSource<Actividad>();
  etapas: EtapaPlan[] = [];

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(private service: PlanTrabajoService) { }

  ngOnInit() {
    this.subs.push(this.service.planActualSubject.subscribe(planBoard => {
      let actividades: Actividad[] = [];
      planBoard.etapas.forEach(etapa => {
        actividades = actividades.concat(etapa.actividades);
        this.etapas.push(etapa.etapa);
      });
      this.datasource.data = actividades;
    }));
    this.service.fetchPlanActual();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  editActividad(actividad: Actividad) {
  }

  deleteActividad(idActividad: number) {

  }


  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
