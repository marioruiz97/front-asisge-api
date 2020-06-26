import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EtapaPlan, PlanTrabajo, Cierre } from 'src/app/models/proyectos/plan-trabajo.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.css']
})
export class CierresComponent implements OnInit, OnDestroy {

  cierreForm: FormGroup;
  isWaiting = false;
  private modo: number;

  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CierresComponent>,
    private uiService: UiService,
    private service: PlanTrabajoService,
    public auth: AuthService
  ) {
    this.modo = data.idEtapaPDT ? 2 : 1;
  }

  ngOnInit() {
    this.initForm();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    if (this.data.cierre) {
      this.setForm(this.data.cierre);
    }
  }

  private initForm() {
    this.cierreForm = new FormGroup({
      avalCliente: new FormControl(false),
      observaciones: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      createdDate: new FormControl({ value: new Date(), disabled: true }),
    });
    if (!this.auth.hasRole('ROLE_CLIENTE')) {
      this.cierreForm.get('avalCliente').disable();
    }
  }

  private setForm(cierre: Cierre) {
    this.cierreForm.setValue({
      avalCliente: cierre.avalCliente,
      observaciones: cierre.observaciones,
      createdDate: new Date(cierre.createdDate),
    });
  }

  onSubmit() {
    const cierre: Cierre = { ...this.cierreForm.value };
    cierre.avalCliente = this.cierreForm.get('avalCliente').value;
    if (this.modo === 1) {
      this.service.cerrarPlan(this.data.idPlanDeTrabajo, cierre).subscribe(newCierre => this.dialogRef.close(newCierre));
    } else {
      this.service.cerrarEtapa(this.data.idEtapaPDT, cierre).subscribe(newCierre => this.dialogRef.close(newCierre));
    }
  }

  getTitulo() {
    const title = this.data.idEtapaPDT ? 'Etapa' : 'Plan';
    return `Cierre de ${title}`;
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
