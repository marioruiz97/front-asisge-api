import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlantillaActividad } from 'src/app/models/proyectos/plantilla.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './actividad-form.component.html',
  styleUrls: ['./actividad-form.component.css']
})
export class ActividadFormComponent implements OnInit {

  actividadForm: FormGroup;
  private curId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlantillaActividad,
    private dialogRef: MatDialogRef<ActividadFormComponent>
  ) { }

  ngOnInit() {
    this.initForm();
    if (this.data.duracion && this.data.nombre) {
      this.setForm(this.data);
    }
  }

  initForm() {
    this.actividadForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      duracion: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  setForm(actividad: PlantillaActividad) {
    this.curId = actividad.idActividad;
    this.actividadForm.setValue({
      nombre: actividad.nombre,
      duracion: actividad.duracion,
    });
  }

  onSubmit() {
    const result = { ...this.actividadForm.value, idActividad: this.curId ? this.curId : 0 };
    this.dialogRef.close(result);
  }


}
