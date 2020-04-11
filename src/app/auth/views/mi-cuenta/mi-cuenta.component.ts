import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatDialog } from '@angular/material';
import { CuentaService } from './cuenta.service';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit, OnDestroy {

  private currentUser: Usuario;
  private idUsuario: number;
  private subs: Subscription[] = [];
  accountForm: FormGroup;
  enableFields = false;

  constructor(
    private authService: AuthService,
    private cuentaService: CuentaService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.initForm();
      this.getMyInfo();
      this.getMyProjects();
    } else {
      this.authService.goToHome();
    }
  }

  initForm() {
    this.accountForm = new FormGroup({
      nombre: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(40)]),
      apellido1: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]),
      apellido2: new FormControl({ value: '', disabled: true }, [Validators.maxLength(30)]),
      telefono: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(12)]),
      correo: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(64)]),
      identificacion: new FormControl({ value: '', disabled: true }),
      tipoDocumento: new FormControl({ value: '', disabled: true })
    });
  }

  setForm(usuario: Usuario) {
    const tipoDoc = usuario.tipoDocumento as TipoDocumento;
    this.accountForm.setValue({
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      telefono: usuario.telefono,
      correo: usuario.correo,
      identificacion: usuario.identificacion,
      tipoDocumento: tipoDoc.nombreTipoDocumento,
    });
  }

  /*
 metodo usado para activar formulario de edición y para aparecer los botonoes de guardar y cancelar
 */
  toggleEdit() {
    this.enableFields = !this.enableFields;
    if (this.enableFields) {
      this.enableControls();
    } else {
      this.disableControls();
    }
  }

  enableControls() {
    const controls = ['nombre', 'apellido1', 'apellido2', 'telefono', 'correo'];
    controls.forEach(control => this.accountForm.controls[control].enable());
  }

  disableControls() {
    const controls = ['nombre', 'apellido1', 'apellido2', 'telefono', 'correo'];
    controls.forEach(control => this.accountForm.controls[control].disable());
  }

  getMyInfo() {
    this.subs.push(this.cuentaService.myInfo.subscribe(res => {
      this.currentUser = res.body as Usuario;
      this.idUsuario = this.currentUser.idUsuario;
      this.setForm(this.currentUser);
    }));
  }

  saveMyInfo() {
    const form = this.accountForm.value;
    const user = {
      idUsuario: this.idUsuario,
      nombre: form.nombre,
      apellido1: form.apellido1,
      apellido2: form.apellido2,
      telefono: form.telefono,
      correo: form.correo
    };
    this.toggleEdit();
    this.cuentaService.saveMyInfo(user).finally(() => this.getMyInfo());
  }

  getMyProjects() {

  }

  onChangePass() {
    this.matDialog.open(ChangePasswordComponent, { data: { idUsuario: this.idUsuario } });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}
