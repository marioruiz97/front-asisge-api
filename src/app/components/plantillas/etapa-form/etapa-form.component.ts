import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlantillaEtapa } from 'src/app/models/proyectos/plantilla.model';

@Component({
  templateUrl: './etapa-form.component.html',
  styleUrls: ['./etapa-form.component.css']
})
export class EtapaFormComponent implements OnInit {
  etapaForm: FormGroup;
  private curId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlantillaEtapa,
    private dialogRef: MatDialogRef<EtapaFormComponent>
  ) { }

  ngOnInit() {
    this.initForm();
    if (this.data.duracion && this.data.nombreEtapa) {
      this.setForm(this.data);
    }
  }

  initForm() {
    this.etapaForm = new FormGroup({
      nombreEtapa: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      duracion: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  setForm(etapa: PlantillaEtapa) {
    this.curId = etapa.idPlantillaEtapa;
    this.etapaForm.setValue({
      nombreEtapa: etapa.nombreEtapa,
      duracion: etapa.duracion,
    });
  }

  onSubmit() {
    const result = { ...this.etapaForm.value, idPlantillaEtapa: this.curId ? this.curId : 0 };
    this.dialogRef.close(result);
  }

}
