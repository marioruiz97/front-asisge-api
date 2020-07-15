import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Contacto } from 'src/app/models/terceros/cliente.model';

@Component({
  selector: 'app-contacto-form',
  templateUrl: './contacto-form.component.html'
})
export class ContactoFormComponent implements OnInit {

  contactoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Contacto,
    public dialogRef: MatDialogRef<ContactoFormComponent>
  ) { }

  ngOnInit() {
    this.initForm();
    this.dialogRef.disableClose = true;
    if (this.data) {
      this.setForm(this.data);
    }
  }

  private initForm() {
    this.contactoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      telefono: new FormControl('', [Validators.pattern('([0-9]*)')]),
      correo: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  private setForm(data: Contacto) {
    this.contactoForm.setValue({
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo
    });
  }

  onSubmit() {
    const result = this.contactoForm.value;
    result.id = this.data.id;
    result.idCliente = this.data.idCliente ? this.data.idCliente : 0;
    this.dialogRef.close(result);
  }

}
