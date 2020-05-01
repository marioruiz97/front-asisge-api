import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MiembroDto, Miembros } from 'src/app/models/proyectos/proyecto.model';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DashboardService } from '../../dashboard/dashboard.service';
import { MatStepper, MatDialogRef } from '@angular/material';
import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-agregar-miembro',
  templateUrl: './agregar-miembro.component.html',
  styleUrls: ['./agregar-miembro.component.css']
})
export class AgregarMiembroComponent implements OnInit, OnDestroy {

  miembroForm: FormGroup;
  usuarios: Usuario[] = [];
  filteredUsuarios: Observable<Usuario[]>;
  miembros: Miembros[] = [];

  private idProyecto: number;
  private nuevoMiembro: MiembroDto;
  private subs: Subscription[] = [];

  constructor(
    private dashboardService: DashboardService,
    private uiService: UiService,
    private dialogRef: MatDialogRef<AgregarMiembroComponent>,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.fetchUsuarios();
    this.fetchMiembrosActuales();
    this.filteredUsuarios = this.miembroForm.get('usuario').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filter(value) : this.usuarios.slice())
    );
  }

  private fetchUsuarios() {
    this.subs.push(this.dashboardService.fetchPosiblesMiembros().subscribe(res => {
      this.usuarios = res.body as Usuario[];
      this.idProyecto = this.dashboardService.dashboard.idDashboard;
    }));
  }

  private fetchMiembrosActuales() {
    this.subs.push(this.authService.currentUser.subscribe(tokenInfo => {
      const idUsuario = tokenInfo ? tokenInfo.userid : 0;
      this.subs.push(this.dashboardService.miembros.subscribe(list => {
        this.miembros = list.filter(user => user.usuario.idUsuario !== idUsuario);
      }));
      this.dashboardService.fetchMiembros();
    }));
    this.authService.initAuth();
  }

  private initForm() {
    this.miembroForm = new FormGroup({
      usuario: new FormControl('', Validators.required),
      rol: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  private _filter(value: string): Usuario[] {
    const filterValue = value.trim().toLowerCase();
    return this.usuarios.filter(user =>
      user.nombre.toLowerCase().includes(filterValue) || user.correo.toLowerCase().includes(filterValue)
    ).slice();
  }

  getNombre(usuario: Usuario) {
    return `${usuario.nombre} ${usuario.apellido1}`;
  }

  guardarMiembro(stepper: MatStepper) {
    if (this.nuevoMiembro) {
      this.dashboardService.crearMiembro(this.nuevoMiembro).then(res => {
        this.uiService.showSnackBar('Usuario agregado con éxito', 3);
        this.usuarios = this.usuarios.filter(user => user.idUsuario !== this.nuevoMiembro.usuario);
        this.dashboardService.agregarMiembroLista(res.body as Miembros);
        this.nuevoMiembro = undefined;
        this.initForm();
        stepper.reset();
      }).catch(_ => this.uiService.showSnackBar('No se ha podido agregar usuario', 3));
    } else {
      this.uiService.showSnackBar('Asegúrate de haber agregado un usuario en el paso anterior', 3);
    }
  }

  eliminarMiembro(miembro: Miembros) {
    this.dashboardService.eliminarMiembro(miembro);
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    const usuario = this.usuarios.find(user => user.correo === this.miembroForm.value.usuario.trim()).idUsuario;
    this.nuevoMiembro = {
      usuario,
      proyecto: this.idProyecto,
      rolProyecto: this.miembroForm.value.rol,
    };
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
