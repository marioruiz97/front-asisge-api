import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlantillaService } from '../plantilla.service';
import { UiService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-plantilla-form',
  templateUrl: './plantilla-form.component.html',
  styleUrls: ['./plantilla-form.component.css']
})
export class PlantillaFormComponent implements OnInit, OnDestroy {

  isUpdate = false;
  isWaiting = false;
  plantillaForm: FormGroup;
  actividadForm: FormGroup;

  private curId: number;
  private subs: Subscription[] = [];

  constructor(
    private service: PlantillaService, private uiService: UiService, private activatedRoute: ActivatedRoute,
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
    this.actividadForm = new FormGroup({
      nombreEtapa: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      duracion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    });
  }

  getPlantilla(id: number) {
    this.service.fetchPlantillaById(id)
      .then()
      .catch(err => this.service.showNotFound(err));
  }

  onSubmit() {

  }


  addEtapa() {

  }

  addActividad() {

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
