import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Proyecto } from 'src/app/models/proyectos/proyecto.model';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UiService } from 'src/app/shared/ui.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PlanTrabajo } from 'src/app/models/proyectos/plan-trabajo.model';
import { PlanTrabajoService } from '../plan-trabajo/plan-trabajo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  cliente: Cliente;
  proyecto: Proyecto;
  isWaiting = true;

  planForm: FormGroup;
  planes: PlanTrabajo[] = [];
  horasMes: number;

  private subs: Subscription[] = [];

  constructor(
    private service: DashboardService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private planTrabajoService: PlanTrabajoService
  ) { }

  ngOnInit() {
    this.subs.push(this.uiService.dashboardLoading.subscribe(state => this.isWaiting = state));
    this.subs.push(this.service.cliente.subscribe(cliente => this.cliente = cliente));
    this.subs.push(this.service.proyecto.subscribe(proyecto => this.proyecto = proyecto));
    this.subs.push(this.planTrabajoService.planActualSubject.subscribe(plan =>
      this.horasMes = plan && plan.planDeTrabajo ? plan.planDeTrabajo.horasMes : null));
    this.subs.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.service.fetchDashboard(id);
        this.planTrabajoService.limpiarPlan(id);
        this.subs.push(this.planTrabajoService.fetchPlanesDeTrabajo(id).subscribe(res => this.planes = res.body));
      }
    }));
    this.planTrabajoService.fetchPlanActual();
    this.initForm();
  }

  initForm() {
    this.planForm = new FormGroup({
      planTrabajo: new FormControl('', Validators.required)
    });
  }

  selectPlan() {
    this.planTrabajoService.selectActual(this.planForm.value.planTrabajo);
  }

  returnIdentificacion() {
    if (this.cliente) {
      return `${this.cliente.tipoDocumento.nombreTipoDocumento}: ${this.cliente.identificacion}`;
    }
  }

  recargarDashboard() {
    this.service.recargarDashboard();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
