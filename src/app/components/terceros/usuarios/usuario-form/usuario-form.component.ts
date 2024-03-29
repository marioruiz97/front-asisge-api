import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  usuarioForm: FormGroup;
  tiposDoc: TipoDocumento[] = [];
  isUpdate = false;
  isWaiting = false;

  private subscriptions: Subscription[] = [];
  private curId: number;
  private curPassword: string;

  constructor(
    private service: UsuarioService, private activatedRoute: ActivatedRoute, private uiService: UiService
  ) { }

  ngOnInit() {
    this.fetchDocumentos();
    this.initForm();
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.getUsuario(id);
      }
    }));
    this.subscriptions.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
  }

  fetchDocumentos() {
    this.subscriptions.push(this.service.fetchDocumentos().subscribe(res => this.tiposDoc = res.body));
  }

  initForm() {
    this.usuarioForm = new FormGroup({
      idUsuario: new FormControl({ value: '', disabled: true }),
      tipoDocumento: new FormControl('', [Validators.required]),
      identificacion: new FormControl('', [Validators.required, Validators.min(99999), Validators.max(999999999999999)]),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(80)]),
      apellido1: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      apellido2: new FormControl('', [Validators.maxLength(40)]),
      telefono: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.pattern('(^$|[0-9]*)')]),
      correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(64)]),
      contrasena: new FormControl('', [Validators.minLength(6), Validators.maxLength(14)]),
      matchContrasena: new FormControl('', [Validators.minLength(6), Validators.maxLength(14)]),
      estado: new FormControl(false),
      perfil: new FormControl(3, [Validators.required])
    });
  }

  getUsuario(id: number) {
    this.service.fetchById(id)
      .then(res => this.setForm(res.body))
      .catch(err => this.service.showNotFound(err));
  }

  setForm(usuario: Usuario) {
    const tipoDoc = usuario.tipoDocumento as TipoDocumento;
    const rol = usuario.roles && usuario.roles.length > 0 ? usuario.roles[0].id : 3;
    this.curId = usuario.idUsuario;
    this.curPassword = usuario.contrasena;
    this.isUpdate = true;
    this.usuarioForm.setValue({
      idUsuario: usuario.idUsuario,
      tipoDocumento: tipoDoc.id,
      identificacion: usuario.identificacion,
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2 ? usuario.apellido2 : '',
      telefono: usuario.telefono ? usuario.telefono : '',
      correo: usuario.correo,
      estado: usuario.estado,
      perfil: rol,
      contrasena: '', matchContrasena: ''
    });
  }

  printErrors(): string[] {
    const controls = ['nombre', 'apellido1', 'tipoDocumento', 'identificacion', 'telefono', 'correo'];
    const result: string[] = [];
    controls.forEach(control => {
      if (this.usuarioForm.controls[control].errors !== null) { result.push(control !== 'tipoDocumento' ? control : 'tipo de documento'); }
    });
    if (this.usuarioForm.get('contrasena').value.length > 0 && this.usuarioForm.get('contrasena').value.length < 6) {
      result.push('Contraseña y verificar contraseña');
    }
    return result;
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

  isValidPassword(password: string, confirm: string) {
    return password === confirm ? true : false;
  }

  /*
  * Método para determinar si se debe crear o actualizar un usuario.
  * 1. se valida si el campo contraseña esta diligenciado, si corresponde a confirmar contraseña
  * 2. valida que si el id del usuario y el currentUser son diferentes de null o undefined entonces se debe actualizar
  * 3. si id es null y currentuser tambien entonces crea el usuario
  * 3.1 si la accion es crear entonces valida que contraseña esté diligenciado, sino saca error
  */
  onSubmit() {
    // validar si password y confirm son iguales
    if (this.usuarioForm.value.contrasena) {
      if (!this.isValidPassword(this.usuarioForm.value.contrasena, this.usuarioForm.value.matchContrasena)) {
        return this.uiService.showSnackBar('Las contraseñas no coinciden', 2, 'Ok');
      }
    }
    const form = this.usuarioForm.value;
    form.roles = [{ id: parseInt(form.perfil, 10) }];
    if (this.curId && this.curId !== 0) {
      form.contrasena = this.usuarioForm.value.contrasena ? form.contrasena : this.curPassword;
      this.service.update(this.curId, form);
    } else {
      if (!this.usuarioForm.value.contrasena) { return this.uiService.showSnackBar('La contraseña es obligatoria', 2, 'Ok'); }
      this.service.create(form);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) { this.subscriptions.forEach(sub => sub.unsubscribe()); }
  }

}
