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
      condicion: new FormControl(0)
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
    let condicion = 0;
    if (estado.actividadNoAprobada) { condicion = 2; }
    if (estado.actividadCompletada) { condicion = 3; }
    if (estado.estadoInicial) { condicion = 1; }
    this.estadoForm.setValue({
      idEstado: estado.idEstado,
      nombreEstado: estado.nombreEstado,
      descripcion: estado.descripcion,
      condicion
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
    const estado: EstadoActividad = { ...this.estadoForm.value };
    switch (this.estadoForm.value.condicion) {
      case 1:
        estado.estadoInicial = true;
        estado.actividadNoAprobada = false;
        estado.actividadCompletada = false;
        break;
      case 2:
        estado.estadoInicial = false;
        estado.actividadNoAprobada = true;
        estado.actividadCompletada = false;
        break;
      case 3:
        estado.estadoInicial = false;
        estado.actividadNoAprobada = false;
        estado.actividadCompletada = true;
        break;
      default:
        estado.estadoInicial = false;
        estado.actividadNoAprobada = false;
        estado.actividadCompletada = false;
        break;
    }
    if (this.curId && this.curId !== 0) {
      this.service.update(this.curId, estado);
    } else {
      this.service.create(estado);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) { this.subscriptions.forEach(sub => sub.unsubscribe()); }
  }

}
