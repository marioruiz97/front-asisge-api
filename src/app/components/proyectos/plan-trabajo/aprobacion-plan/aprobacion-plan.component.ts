import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlanTrabajo } from 'src/app/models/proyectos/plan-trabajo.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl: './aprobacion-plan.component.html',
  styleUrls: ['./aprobacion-plan.component.css']
})
export class AprobacionPlanComponent implements OnInit, OnDestroy {

  isWaiting = false;
  aprobacionForm: FormGroup;
  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlanTrabajo,
    private dialogRef: MatDialogRef<AprobacionPlanComponent>,
    private uiService: UiService,
    private service: PlanTrabajoService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    /* this.subs.push(this.service.fetchEstados(this.data.estadoProyecto.id).subscribe(res => this.estados = res.body)); */
  }

  private initForm() {
    this.aprobacionForm = new FormGroup({
      fechaAprobacion: new FormControl({ value: new Date(), disabled: true }, Validators.required),
      avalCliente: new FormControl(''),
      observaciones: new FormControl('', Validators.maxLength(255))
    });
    if (!this.auth.hasRole('ROLE_CLIENTE')){
      this.aprobacionForm.get('avalCliente').disable();
    }
  }


  onSubmit() {
    /* this.service.pasarEstadoProyecto(this.data.idProyecto, this.estadoForm.value.estado).subscribe(exito => {
      if (exito) { this.dialogRef.close(this.data); }
    }); */
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
