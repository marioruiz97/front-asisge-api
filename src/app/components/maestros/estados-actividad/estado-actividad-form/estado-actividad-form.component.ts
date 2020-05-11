import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EstadoActividadService } from '../estado-actividad.service';
import { ActivatedRoute } from '@angular/router';
import { UiService } from 'src/app/shared/ui.service';
import { EstadoActividad } from 'src/app/models/proyectos/estado-actividad.model';

@Component({
  selector: 'app-estado-actividad-form',
  templateUrl: './estado-actividad-form.component.html',
  styleUrls: ['./estado-actividad-form.component.css']
})
export class EstadoActividadFormComponent implements OnInit, OnDestroy {

  estadoForm: FormGroup;
  isUpdate = false;
  isWaiting = false;

  private subscriptions: Subscription[] = [];
  private curId: number;

  constructor(
    private service: EstadoActividadService, private activatedRoute: ActivatedRoute, private uiService: UiService
  ) { }

  ngOnInit() {
    this.initForm();
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.getEstado(id);
      }
    }));
    this.subscriptions.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
  }

  private initForm() {
    this.estadoForm = new FormGroup({
      idEstado: new FormControl({ value: '', disabled: true }),
      nombreEstado: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl('', [Validators.maxLength(255)]),
      estadoInicial: new FormControl(false),
      actividadNoAprobada: new FormControl(false),
      actividadCompletada: new FormControl(false)
    });
  }

  private getEstado(id: number) {
    this.service.fetchEstadoById(id)
      .then(res => this.setForm(res.body))
      .catch(err => {
        this.service.showNotFound(err);
      });
  }

  private setForm(estado: EstadoActividad) {
    this.curId = estado.idEstado;
    this.isUpdate = true;
    this.estadoForm.setValue({
      idEstado: estado.idEstado,
      nombreEstado: estado.nombreEstado,
      descripcion: estado.descripcion,
      estadoInicial: estado.estadoInicial,
      actividadNoAprobada: estado.actividadNoAprobada,
      actividadCompletada: estado.actividadCompletada
    });
  }

  goBack() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.returnToList();
      }
    }));
  }

  onSubmit() {
    if (this.curId && this.curId !== 0) {
      this.service.update(this.curId, this.estadoForm.value);
    } else {
      this.service.create(this.estadoForm.value);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) { this.subscriptions.forEach(sub => sub.unsubscribe()); }
  }

}
