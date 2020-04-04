import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Contacto } from 'src/app/models/terceros/cliente.model';

@Component({
  selector: 'app-contacto-form',
  templateUrl: './contacto-form.component.html'
})
export class ContactoFormComponent implements OnInit {

  nombre = '';
  telefono = '';
  correo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Contacto,
    public dialogRef: MatDialogRef<ContactoFormComponent>
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    if (this.data) {
      this.nombre = this.data.nombre;
      this.telefono = this.data.telefono;
      this.correo = this.data.correo;
    }
  }

  onSubmit(f: NgForm) {
    const result = f.value;
    result.id = this.data.id;
    result.idCliente = this.data.idCliente ? this.data.idCliente : 0;
    this.dialogRef.close(result);
  }

}
