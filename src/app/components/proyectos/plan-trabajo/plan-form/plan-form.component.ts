import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { PlanTrabajo } from 'src/app/models/proyectos/plan-trabajo.model';

@Component({
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit, OnDestroy {

  planForm: FormGroup;
  isWaiting = false;
  minDate = new Date();
  maxDate: Date = null;

  private params: ParamMap;
  private curPlanId: number;
  isUpdate = false;

  private idProyecto: number;
  private subs: Subscription[] = [];

  constructor(
    private uiService: UiService, private service: PlanTrabajoService,
    private dashboardService: DashboardService, private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initForm();
    this.subs.push(this.activatedRoute.paramMap.subscribe(params => this.params = params));
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.dashboardService.proyecto.subscribe(proyecto => {
      this.minDate = proyecto.createdDate ? proyecto.createdDate : this.minDate;
      this.maxDate = proyecto.fechaCierreProyecto ? proyecto.fechaCierreProyecto : null;
      this.idProyecto = proyecto.idProyecto;
      if (this.params.has('idPlan')) {
        const idPlan = +this.params.get('idPlan');
        if (idPlan && idPlan !== 0) {
          if (this.service.planActual && this.service.planActual.idPlanDeTrabajo === idPlan) {
            this.setForm(this.service.planActual.planDeTrabajo);
          } else {
            this.uiService.showConfirm({ title: 'Error', message: 'No se pudo obtener información' });
            this.service.returnToDashboard();
          }
        }
      }
    }));
    if (isNullOrUndefined(this.dashboardService.dashboard)) {
      const id = +this.params.get('id');
      if (id && id !== 0) {
        this.dashboardService.fetchDashboard(id);
      }
    }
    this.dashboardService.fetchInfoProyecto();
  }

  private initForm() {
    this.planForm = new FormGroup({
      nombrePlan: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      fechaInicio: new FormControl('', Validators.required),
      fechaFinEstimada: new FormControl('', Validators.required),
      horasMes: new FormControl(1, [Validators.required, Validators.min(1)]),
      objetivoPlan: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  private setForm(plan: PlanTrabajo) {
    this.curPlanId = plan.idPlanDeTrabajo;
    this.isUpdate = true;
    this.planForm.setValue({
      nombrePlan: plan.nombrePlan,
      fechaInicio: plan.fechaInicio,
      fechaFinEstimada: plan.fechaFinEstimada,
      horasMes: plan.horasMes,
      objetivoPlan: plan.objetivoPlan
    });
  }

  onSubmit() {
    if (this.isUpdate) {
      this.service.editarPlan(this.planForm.value, this.curPlanId);
    } else {
      this.service.crearPlan(this.planForm.value, this.idProyecto);
    }
  }

  printErrors(): string[] {
    const controls = ['nombrePlan', 'horasMes', 'fechaInicio', 'fechaFinEstimada', 'objetivoPlan'];
    const result: string[] = [];
    controls.forEach(control => {
      if (this.planForm.controls[control].errors !== null) {
        let printable: string;
        switch (control) {
          case 'nombrePlan':
            printable = 'Nombre del plan';
            break;
          case 'horasMes':
            printable = 'Horas por mes';
            break;
          case 'fechaInicio':
            printable = 'Fecha de inicio';
            break;
          case 'fechaFinEstimada':
            printable = 'Fecha fin estimada';
            break;
          case 'objetivoPlan':
            printable = 'Objetivo del Plan';
            break;
          default:
            printable = control;
            break;
        }
        result.push(printable);
      }
    });
    return result;
  }

  goBack() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) { this.service.returnToDashboard(); }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
