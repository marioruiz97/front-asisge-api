import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { Seguimiento } from 'src/app/models/proyectos/actividad.model';

@Component({
  selector: 'app-seguimiento-form',
  templateUrl: './seguimiento-form.component.html',
  styleUrls: ['./seguimiento-form.component.css']
})
export class SeguimientoFormComponent implements OnInit, OnDestroy {

  seguimientoForm: FormGroup;
  isWaiting = false;

  private subs: Subscription[] = [];

  @Input() idActividad: number;
  @Input() seguimiento: Seguimiento;

  @Output() cerrarForm = new EventEmitter();
  @Output() recargarSeguimiento = new EventEmitter();

  constructor(private service: PlanTrabajoService, private uiService: UiService) { }

  ngOnInit() {
    this.initForm();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    if (this.seguimiento) {
      this.setForm();
    }
  }

  private initForm() {
    this.seguimientoForm = new FormGroup({
      horasTrabajadas: new FormControl(0, [Validators.required, Validators.min(1)]),
      descripcionLabor: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      observaciones: new FormControl('', [Validators.maxLength(255)]),
    });
  }

  private setForm() {
    this.seguimientoForm.setValue({
      horasTrabajadas: this.seguimiento.horasTrabajadas,
      descripcionLabor: this.seguimiento.descripcionLabor,
      observaciones: this.seguimiento.observaciones,
    });
  }

  onSubmit() {
    const seguimiento: Seguimiento = { ...this.seguimientoForm.value, actividadAsociada: this.idActividad };
    if (this.seguimiento) {
      seguimiento.idSeguimiento = this.seguimiento.idSeguimiento;
      this.subs.push(this.service.editarSeguimiento(this.idActividad, seguimiento).subscribe(exito => {
        if (exito) {
          this.closeForm();
          this.recargaSeguimiento();
        }
      }));
    } else {
      this.subs.push(this.service.crearSeguimiento(this.idActividad, seguimiento).subscribe(exito => {
        if (exito) {
          this.closeForm();
          this.recargaSeguimiento();
        }
      }));
    }
  }

  closeForm() {
    this.seguimiento = undefined;
    this.cerrarForm.emit();
  }

  recargaSeguimiento() {
    this.recargarSeguimiento.emit();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
