import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { PlantillaService } from '../plantilla.service';
import { UiService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlantillaEtapa, Plantilla, PlantillaActividad } from 'src/app/models/proyectos/plantilla.model';
import { MatDialog } from '@angular/material';
import { BASIC_DIALOG_CONFIG } from 'src/app/shared/routing/app.constants';
import { ActividadFormComponent } from '../actividad-form/actividad-form.component';
import { EtapaFormComponent } from '../etapa-form/etapa-form.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-plantilla-form',
  templateUrl: './plantilla-form.component.html',
  styleUrls: ['./plantilla-form.component.css']
})
export class PlantillaFormComponent implements OnInit, OnDestroy {

  isUpdate = false;
  isWaiting = false;
  plantillaForm: FormGroup;
  etapas: PlantillaEtapa[] = [];
  private curId: number;
  private subs: Subscription[] = [];

  constructor(
    private service: PlantillaService, private uiService: UiService,
    private activatedRoute: ActivatedRoute, private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.initForms();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.getPlantilla(id);
      }
    }));
  }

  initForms() {
    this.plantillaForm = new FormGroup({
      idPlantilla: new FormControl({ value: '', disabled: true }),
      nombrePlantilla: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      descripcionPlantilla: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      duracion: new FormControl(1, [Validators.required, Validators.min(1)]),
      horasMes: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  private setForm(plantilla: Plantilla) {
    this.curId = plantilla.idPlantilla;
    this.isUpdate = true;
    this.plantillaForm.setValue({
      idPlantilla: plantilla.idPlantilla,
      nombrePlantilla: plantilla.nombrePlantilla,
      descripcionPlantilla: plantilla.descripcionPlantilla,
      duracion: plantilla.duracion,
      horasMes: plantilla.horasMes,
    });
  }

  private getPlantilla(id: number) {
    this.subs.push(this.service.fetchPlantillaById(id).subscribe(res => {
      const plantilla = res.body as Plantilla;
      this.etapas = plantilla.etapas ? plantilla.etapas : [];
      this.etapas.forEach(etapa => etapa.observable = new Subject<PlantillaActividad[]>());
      this.setForm(plantilla);
      setTimeout(_ => this.etapas.forEach(etapa => etapa.observable.next(etapa.actividades)), 2000);
    }, err => this.service.showNotFound(err)));
  }

  onSubmit() {
    const data: Plantilla = { ...this.plantillaForm.value, etapas: [...this.etapas] };
    data.etapas.forEach((etapa: PlantillaEtapa) => {
      etapa.observable.complete();
      delete etapa.observable;
    });
    if (this.curId && this.curId !== 0 && this.isUpdate) {
      this.service.update(this.curId, data);
    } else {
      this.service.create(data);
    }
  }

  saveEtapa(etapa: PlantillaEtapa = null) {
    this.$addEtapa(etapa);
  }

  private $addEtapa(etapa: PlantillaEtapa) {
    const data = etapa !== null ? etapa : {};
    const isCreate = etapa !== null ? false : true;
    const dialogRef = this.dialog.open(EtapaFormComponent, { ...BASIC_DIALOG_CONFIG, disableClose: true, data });
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result.idPlantillaEtapa != null) {
        if (isCreate) {
          delete result.idPlantillaEtapa;
          this.etapas.push({ ...result, actividades: [], observable: new Subject<PlantillaActividad[]>() });
        } else {
          this.etapas.filter(e => e.nombreEtapa === etapa.nombreEtapa && e.duracion === etapa.duracion)
            .map(edit => {
              if (!edit.observable) {
                edit.observable = new Subject<PlantillaActividad[]>();
              }
              edit.nombreEtapa = result.nombreEtapa;
              edit.duracion = result.duracion;
            });
        }
      }
    }));
  }

  deleteEtapa(etapa: PlantillaEtapa) {
    etapa.observable.complete();
    this.etapas = this.etapas.filter(e => (e.nombreEtapa !== etapa.nombreEtapa && e.actividades !== etapa.actividades)
      || e.duracion !== etapa.duracion);
  }

  saveActividad(etapa: PlantillaEtapa, actividad: PlantillaActividad = null) {
    const data = actividad !== null ? actividad : {};
    const isCreate = actividad !== null ? false : true;
    const dialogRef = this.dialog.open(ActividadFormComponent, { ...BASIC_DIALOG_CONFIG, disableClose: true, data });
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (!isNullOrUndefined(result.idActividad)) {
        if (isCreate) {
          delete result.idActividad;
          etapa.actividades.push({ ...result });
        } else {
          etapa.actividades.filter(a => a.nombre === actividad.nombre && a.duracion === actividad.duracion)
            .map(at => {
              at.nombre = result.nombre;
              at.duracion = result.duracion;
            });
        }
        etapa.observable.next(etapa.actividades);
      }
    }));
  }

  deleteActividad(etapa: PlantillaEtapa, actividad: PlantillaActividad) {
    etapa.actividades = etapa.actividades.filter(act => act.nombre !== actividad.nombre || act.duracion !== actividad.duracion);
    etapa.observable.next(etapa.actividades);
  }

  goBack() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.returnToList();
      }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
