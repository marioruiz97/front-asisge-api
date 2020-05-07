import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { Miembros } from 'src/app/models/proyectos/proyecto.model';

@Component({
  templateUrl: './modal-actividad.component.html',
  styleUrls: ['./modal-actividad.component.css']
})
export class ModalActividadComponent implements OnInit, OnDestroy {

  isWaiting = false;
  actividadForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  etapas: EtapaPlan[] = [];
  miembros: Miembros[] = [];

  private idActividad: number;
  private idPlanTrabajo: number;
  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Actividad,
    private dialogRef: MatDialogRef<ModalActividadComponent>,
    private service: PlanTrabajoService,
    private uiService: UiService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.service.planActualSubject.subscribe(planBoard => {
      const plan = planBoard.planDeTrabajo;
      this.idPlanTrabajo = plan.idPlanDeTrabajo;
      this.etapas = plan.etapas;
      this.minDate = plan.fechaInicio ? plan.fechaInicio : new Date();
      this.maxDate = plan.fechaFinEstimada ? plan.fechaFinEstimada : null;
    }));
    this.subs.push(this.dashboardService.miembros.subscribe(list => this.miembros = list));
    this.initForm();
    this.setForm();
    this.service.fetchPlanActual();
    this.dashboardService.fetchMiembros();
  }

  private initForm() {
    this.actividadForm = new FormGroup({
      idActividad: new FormControl({ value: '', disabled: true }),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(80)]),
      etapa: new FormControl('', [Validators.required]),
      fechaVencimiento: new FormControl(new Date(), [Validators.required]),
      duracion: new FormControl(1, [Validators.required, Validators.min(1)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      responsables: new FormControl('', Validators.required),
    });
  }

  private setForm() {
    if (this.data.idActividad) {
      this.idActividad = this.data.idActividad;
      const responsables = this.data.responsables.map(user => user.idUsuario);
      this.actividadForm.setValue({
        idActividad: this.data.idActividad,
        nombre: this.data.nombre,
        etapa: this.data.etapa,
        fechaVencimiento: this.data.fechaVencimiento ? this.data.fechaVencimiento : new Date(),
        duracion: this.data.duracion,
        descripcion: this.data.descripcion ? this.data.descripcion : '',
        responsables
      });
    }
  }

  onSubmit() {
    if (this.data.idActividad && this.idActividad) {
      // actualizar
      const actividad = { ...this.actividadForm.value, idActividad: this.idActividad };
      this.subs.push(this.service.editActividad(this.idPlanTrabajo, actividad).subscribe(exito => {
        if (exito) { this.dialogRef.close(); }
      }));
    } else {
      // crear
      const actividad = { ...this.actividadForm.value };
      this.subs.push(this.service.createActividad(this.idPlanTrabajo, actividad).subscribe(exito => {
        if (exito) { this.initForm(); }
      }));
    }
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
