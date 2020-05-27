import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlanTrabajo, AprobacionPlan } from 'src/app/models/proyectos/plan-trabajo.model';
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
  archivo: File;
  showArchivo = false;
  private isUpdate = false;
  private loadFile = false;
  private curId: number;
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
    this.subs.push(this.service.fetchAprobacion(this.data.idPlanDeTrabajo).subscribe(res => {
      if (res.body) {
        this.setForm(res.body);
      }
    }));
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
  }

  private initForm() {
    this.aprobacionForm = new FormGroup({
      fechaAprobacion: new FormControl({ value: new Date(), disabled: true }),
      avalCliente: new FormControl(''),
      observaciones: new FormControl('', Validators.maxLength(255)),
      rutaArchivo: new FormControl({ value: '', disabled: true }),
    });
    if (!this.auth.hasRole('ROLE_CLIENTE')) {
      this.aprobacionForm.get('avalCliente').disable();
    }
  }

  private setForm(aprobacion: AprobacionPlan) {
    this.isUpdate = true;
    this.curId = aprobacion.id;
    this.showArchivo = aprobacion.rutaArchivo ? true : false;
    this.aprobacionForm.setValue({
      fechaAprobacion: aprobacion.createdDate ? aprobacion.createdDate : new Date(),
      avalCliente: aprobacion.avalCliente,
      observaciones: aprobacion.observaciones,
      rutaArchivo: aprobacion.rutaArchivo
    });
  }

  seleccionarArchivo(event) {
    if (event.target.files.length !== 0) {
      this.loadFile = true;
      this.archivo = event.target.files[0];
    } else {
      this.loadFile = false;
    }
  }


  onSubmit() {
    this.subs.push(this.service
      .saveAprobacion(this.aprobacionForm.value, this.data.idPlanDeTrabajo, this.isUpdate, this.curId ? this.curId : null)
      .subscribe(exito => {
        if (exito && this.loadFile) {
          // subir imagen
          this.service.fetchAprobacion(this.data.idPlanDeTrabajo).toPromise().then(res => {
            if (res.body) {
              const aprobacion = res.body as AprobacionPlan;
              this.service.cargarArchivo(this.archivo, this.data.idPlanDeTrabajo, aprobacion.id).subscribe(success => {
                if (success) { this.dialogRef.close(); }
              });
            }
          });
        }
      }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
