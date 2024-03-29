import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { ModalActividadComponent } from '../modal-actividad/modal-actividad.component';
import { DIALOG_CONFIG, WIDE_DIALOG_CONFIG } from 'src/app/shared/routing/app.constants';
import { isNullOrUndefined } from 'util';
import { DetalleActividadComponent } from '../detalle-actividad/detalle-actividad.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { PasarActividadEstadoComponent } from '../pasar-actividad-estado/pasar-actividad-estado.component';


export interface FiltroActividad {
  etapa: number;
  usuario: number;
  fechaVencimiento: Date;
  nombre: string;
}

@Component({
  selector: 'app-actividades-plan',
  templateUrl: './actividades-plan.component.html',
  styleUrls: ['./actividades-plan.component.css']
})
export class ActividadesPlanComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription[] = [];
  displayedColumns = ['idActividad', 'nombre', 'etapa', 'estadoActividad', 'fechaVencimiento', 'duracion', 'acciones'];
  datasource = new MatTableDataSource<Actividad>();

  etapas: EtapaPlan[] = [];
  miembrosProyecto: Usuario[] = [];
  filterForm: FormGroup;
  quitarFiltros = false;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private dashboardService: DashboardService, private service: PlanTrabajoService, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initForm();
    this.setSortingAccesor();
    this.datasource.filterPredicate = this.createFilter();
    this.subs.push(this.service.planActualSubject.subscribe(planBoard => {
      let actividades: Actividad[] = [];
      this.etapas = planBoard.etapas.map(etapaBoard => etapaBoard.etapa);
      planBoard.etapas.forEach(etapa => {
        let showAccion = true;
        if (etapa.etapa.cierre || planBoard.planDeTrabajo.cierre) { showAccion = false; }
        etapa.actividades.forEach(actividad => actividad.showAcciones = showAccion);
        actividades = actividades.concat(etapa.actividades);
      });
      this.datasource.data = actividades;
    }));
    this.subs.push(this.dashboardService.miembros.subscribe(miembros => this.miembrosProyecto = miembros.map(miembro => miembro.usuario)));
    this.service.fetchPlanActual();
    this.dashboardService.fetchMiembros();
  }

  private initForm() {
    this.filterForm = new FormGroup({
      etapa: new FormControl(''),
      usuario: new FormControl(''),
      fechaVencimiento: new FormControl(''),
      nombre: new FormControl('')
    });
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  editActividad(actividad: Actividad) {
    const ref = this.dialog.open(ModalActividadComponent, { ...DIALOG_CONFIG, data: actividad });
    // recibir la actividad modificada
    ref.afterClosed().subscribe(result => {
      if (result.idActividad && result.idActividad !== 0) {
        this.datasource.data.filter(e => e.idActividad === result.idActividad).map(act => {
          act.nombre = result.nombre;
          act.fechaVencimiento = result.fechaVencimiento;
          act.duracion = result.duracion;
          act.descripcion = result.descripcion;
        });
      }
    });
  }

  deleteActividad(idActividad: number) {
    this.service.deleteActividad(idActividad).subscribe(exito => {
      if (exito) { this.datasource.data = this.datasource.data.filter(actividad => actividad.idActividad !== idActividad); }
    });
  }

  showDetails(actividad: Actividad) {
    this.dialog.open(DetalleActividadComponent, { ...WIDE_DIALOG_CONFIG, data: actividad });
  }

  changeEstado(actividad: Actividad) {
    const ref = this.dialog.open(PasarActividadEstadoComponent, { ...DIALOG_CONFIG, data: actividad });
    ref.afterClosed().subscribe(result => {
      if (!isNullOrUndefined(result.idActividad)) {
        this.datasource.data.filter(item => item.idActividad === result.idActividad).map(item => {
          item.estadoActividad = result.estadoActividad;
        });
      }
    });
  }

  showApproval(actividad: Actividad) {
    this.service.solicitarAprobacion(actividad);
  }

  private setSortingAccesor() {
    this.datasource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'etapa': return item.etapa.nombreEtapa;
        case 'estadoActividad': return item.estadoActividad.nombreEstado;
        default: return item[property];
      }
    };
  }

  private createFilter(): (data: Actividad, filter: string) => boolean {
    const filterFunction = (data: Actividad, filter: string): boolean => {
      const filtro = JSON.parse(filter) as FiltroActividad;
      const filtroEtapa = !filtro.etapa || (filtro.etapa && filtro.etapa === data.etapa.idEtapaPDT);
      let filtroNombre = true;
      if (filtro.nombre) {
        filtro.nombre = filtro.nombre.toLowerCase();
        filtroNombre = data.nombre.toLowerCase().indexOf(filtro.nombre) !== -1 ||
          (data.descripcion && data.descripcion.toLowerCase().indexOf(filtro.nombre) !== -1);
      }
      const filtroFecha = !filtro.fechaVencimiento || (filtro.fechaVencimiento
        && new Date(data.fechaVencimiento).getTime() < new Date(filtro.fechaVencimiento).getTime());
      const filtroUsuario = !filtro.usuario || (filtro.usuario
        && data.responsables.map(user => user.idUsuario).includes(filtro.usuario));

      return filtroEtapa && filtroFecha && filtroUsuario && filtroNombre;
    };
    return filterFunction;
  }


  doFilter() {
    const filtro: FiltroActividad = this.filterForm.value;
    this.quitarFiltros = true;
    this.datasource.filter = JSON.stringify(filtro);
  }

  removeFilter() {
    const filtro: FiltroActividad = {
      nombre: '', etapa: null, fechaVencimiento: null, usuario: null
    };
    this.quitarFiltros = false;
    this.initForm();
    this.datasource.filter = JSON.stringify(filtro);
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
