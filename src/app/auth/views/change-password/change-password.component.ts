import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CuentaService } from '../mi-cuenta/cuenta.service';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePassForm: FormGroup;
  private idUsuario: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private cuentaService: CuentaService,
    private uiService: UiService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.idUsuario = this.data.idUsuario;
    this.changePassForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(14)]),
      confirm: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(14)]),
    });
  }

  onCloseModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    const form = this.changePassForm.value;
    if (form.password === form.confirm) {
      this.cuentaService.changePassword(form, this.idUsuario).subscribe(exito => {
        if (exito) { this.onCloseModal(); }
      });
    } else {
      this.uiService.showSnackBar('Las contraseñas no coinciden', 2, 'bottom');
    }
  }

}
