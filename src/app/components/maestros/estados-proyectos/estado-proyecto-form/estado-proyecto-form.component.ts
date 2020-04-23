import { Component, OnInit, OnDestroy } from '@angular/core';
import { EstadoProyecto } from 'src/app/models/proyectos/proyecto.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EstadoProyectoService } from '../estado-proyecto.service';
import { ActivatedRoute } from '@angular/router';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-estado-proyecto-form',
  templateUrl: './estado-proyecto-form.component.html',
  styleUrls: ['./estado-proyecto-form.component.css']
})
export class EstadoProyectoFormComponent implements OnInit, OnDestroy {

  estadoForm: FormGroup;
  allEstados: EstadoProyecto[] = [];
  isUpdate = false;
  isWaiting = false;

  private subscriptions: Subscription[] = [];
  private curId: number;

  constructor(
    private service: EstadoProyectoService, private activatedRoute: ActivatedRoute, private uiService: UiService
  ) { }

  ngOnInit() {
    this.fetchEstados();
    this.initForm();
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.getEstado(id);
      }
    }));
    this.subscriptions.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
  }

  initForm() {
    this.estadoForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      nombreEstado: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl('', [Validators.maxLength(255)]),
      idEstadoAnterior: new FormControl(''),
      requerido: new FormControl(false)
    });
  }

  fetchEstados() {
    this.subscriptions.push(this.service.fetchAll().subscribe(res => this.allEstados = res.body));
  }

  getEstado(id: number) {
    this.service.fetchById(id)
      .then(res => this.setForm(res.body))
      .catch(err => {
        this.service.showNotFound(err);
      });
  }

  setForm(estado: EstadoProyecto) {
    this.curId = estado.id;
    this.isUpdate = true;
    this.estadoForm.setValue({
      id: estado.id,
      nombreEstado: estado.nombreEstado,
      descripcion: estado.descripcion,
      idEstadoAnterior: estado.idEstadoAnterior,
      requerido: estado.requerido
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
    console.log(this.estadoForm.value)
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
