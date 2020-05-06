import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';

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

  private idPlanTrabajo: number;
  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Actividad,
    private service: PlanTrabajoService, private uiService: UiService
  ) { }

  ngOnInit() {
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.service.planActualSubject.subscribe(plan => {
      this.idPlanTrabajo = plan.idPlanDeTrabajo;
      this.minDate = plan.fechaInicio ? plan.fechaInicio : new Date();
      this.maxDate = plan.fechaFinEstimada ? plan.fechaFinEstimada : null;
    }));
    this.subs.push(this.service.etapasSubject.subscribe(etapas => this.etapas = etapas));
    this.initForm();
    this.service.fetchPlanActual();
    this.service.fetchEtapas();
  }

  private initForm() {
    this.actividadForm = new FormGroup({
      idActividad: new FormControl({ value: '', disabled: true }),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(80)]),
      etapa: new FormControl('', [Validators.required]),
      fechaVencimiento: new FormControl(new Date(), [Validators.required]),
      duracion: new FormControl(1, [Validators.required, Validators.min(1)]),
      descripcion: new FormControl('', [Validators.minLength(6), Validators.maxLength(255)]),
      /*
            nombreEtapa: new FormControl(this.data.nombreEtapa, [Validators.required, Validators.maxLength(50)]),
            fechaInicio: new FormControl(this.data.fechaInicio, Validators.required),
            fechaFin: new FormControl(this.data.fechaFin, Validators.required), */
    });
  }

  onSubmit() {

  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
