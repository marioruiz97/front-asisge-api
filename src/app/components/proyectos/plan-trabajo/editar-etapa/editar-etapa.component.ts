import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './editar-etapa.component.html',
  styleUrls: ['./editar-etapa.component.css']
})
export class EditarEtapaComponent implements OnInit, OnDestroy {

  isWaiting = false;
  etapaForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  private idPlanTrabajo: number;
  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EtapaPlan, private dialogRef: MatDialogRef<EditarEtapaComponent>,
    private service: PlanTrabajoService, private uiService: UiService
  ) { }

  ngOnInit() {
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.service.planActualSubject.subscribe(planBoard => {
      const plan = planBoard.planDeTrabajo;
      this.idPlanTrabajo = plan.idPlanDeTrabajo;
      this.minDate = plan.fechaInicio ? plan.fechaInicio : new Date();
      this.maxDate = plan.fechaFinEstimada ? plan.fechaFinEstimada : null;
    }));
    this.initForm();
    this.service.fetchPlanActual();
  }

  private initForm() {
    this.etapaForm = new FormGroup({
      nombreEtapa: new FormControl(this.data.nombreEtapa, [Validators.required, Validators.maxLength(50)]),
      fechaInicio: new FormControl(this.data.fechaInicio, Validators.required),
      fechaFin: new FormControl(this.data.fechaFin, Validators.required),
    });
  }

  editarEtapa() {
    // guardar etapa y recibir la nueva etapa
    // devolver la etapa modificada el listado para modificarla
    const etapa = { ...this.etapaForm.value, idEtapaPDT: this.data.idEtapaPDT, planDeTrabajo: this.idPlanTrabajo };
    this.service.editEtapa(this.idPlanTrabajo, etapa).subscribe(exito => {
      if (exito) {
        this.dialogRef.close(etapa);
      }
    });
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
