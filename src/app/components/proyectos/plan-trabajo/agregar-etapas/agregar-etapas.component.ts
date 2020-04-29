import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-agregar-etapas',
  templateUrl: './agregar-etapas.component.html',
  styleUrls: ['./agregar-etapas.component.css']
})
export class AgregarEtapasComponent implements OnInit, OnDestroy {

  etapaForm: FormGroup;
  isWaiting = false;
  minDate = new Date();
  private idPlanTrabajo: number;
  private subs: Subscription[] = [];

  constructor(
    private service: PlanTrabajoService, private uiService: UiService,
    private dialogRef: MatDialogRef<AgregarEtapasComponent>
  ) { }

  ngOnInit() {
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.service.planActualSubject.subscribe(plan => this.idPlanTrabajo = plan.idPlanDeTrabajo));
    this.service.fetchPlanActual();
    this.initForm();
  }

  initForm() {
    this.etapaForm = new FormGroup({
      nombreEtapa: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
    });
  }

  guardarEtapa() {
    this.service.crearEtapa(this.etapaForm.value, this.idPlanTrabajo);
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}

