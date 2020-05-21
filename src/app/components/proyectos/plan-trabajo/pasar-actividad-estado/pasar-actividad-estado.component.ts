import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstadoActividad } from 'src/app/models/proyectos/estado-actividad.model';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { EstadoActividadService } from 'src/app/components/maestros/estados-actividad/estado-actividad.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './pasar-actividad-estado.component.html',
  styleUrls: ['./pasar-actividad-estado.component.css']
})
export class PasarActividadEstadoComponent implements OnInit, OnDestroy {

  isWaiting = false;
  estadoForm: FormGroup;
  estados: EstadoActividad[] = [];
  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Actividad,
    private dialogRef: MatDialogRef<PasarActividadEstadoComponent>,
    private service: PlanTrabajoService, private uiService: UiService,
    private estadoService: EstadoActividadService, private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.estadoService.fetchAllEstados().subscribe(res => {
      this.estados = res.body as EstadoActividad[];
      this.estados = this.estados.filter(estado => estado.idEstado !== this.data.estadoActividad.idEstado);
      if (!this.authService.hasRoles(['ROLE_ADMIN'])) {
        this.estados = this.estados.filter(estado => !estado.actividadCompletada);
      }
    }));
  }

  private initForm() {
    this.estadoForm = new FormGroup({
      estado: new FormControl('', Validators.required)
    });
  }


  onSubmit() {
    this.uiService.loadingState.next(true);
    this.service.changeEstado(this.data, this.estadoForm.value.estado).then(res => {
      this.uiService.loadingState.next(false);
      this.uiService.showSnackBar(res.message, 4);
      this.dialogRef.close(res.body as Actividad);
    }).catch(err => {
      this.uiService.loadingState.next(false);
      if (err.status !== 403) {
        const message = err.error ? err.error.message : 'No se ha podido cambiar actividad de estado';
        const errors: string[] = err.error && err.error.errors ? err.error.errors : [];
        this.uiService.showConfirm({ title: 'Error', message, errors, confirm: 'Ok' });
      }
    });
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
