import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './usuario-clientes.component.html',
  styleUrls: ['./usuario-clientes.component.css']
})
export class UsuarioClientesComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<UsuarioClientesComponent>) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

}
