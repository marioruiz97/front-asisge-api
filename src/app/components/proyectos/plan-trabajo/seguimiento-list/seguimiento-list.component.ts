import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { Seguimiento, Actividad } from 'src/app/models/proyectos/actividad.model';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService, ConfirmDialogData } from 'src/app/shared/ui.service';
import { isNullOrUndefined } from 'util';
import { PasarActividadEstadoComponent } from '../pasar-actividad-estado/pasar-actividad-estado.component';
import { DIALOG_CONFIG } from 'src/app/shared/routing/app.constants';

@Component({
  selector: 'app-seguimiento-list',
  templateUrl: './seguimiento-list.component.html',
  styleUrls: ['./seguimiento-list.component.css']
})
export class SeguimientoListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['usuarioSeguimiento', 'createdDate', 'horasTrabajadas', 'descripcionLabor', 'acciones'];
  datasource = new MatTableDataSource<Seguimiento>();
  showForm = false;
  idActividad: number;
  editSeguimiento: Seguimiento;

  private curUser: number;
  private subs: Subscription[] = [];

  @Input() actividad: Actividad;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private service: PlanTrabajoService, private auth: AuthService,
    private uiService: UiService, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.idActividad = this.actividad.idActividad;
    this.subs.push(this.auth.currentUser.subscribe(tokenInfo => this.curUser = tokenInfo.userid));
    this.fetchSeguimientos();
    this.auth.fetchTokenInfo();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetchSeguimientos() {
    this.subs.push(this.service.fetchSeguimientos(this.idActividad).subscribe(res => this.datasource.data = res.body as Seguimiento[]));
  }

  showApproval() {
    this.service.solicitarAprobacion(this.actividad);
  }

  changeEstado() {
    const ref = this.dialog.open(PasarActividadEstadoComponent, { ...DIALOG_CONFIG, data: this.actividad });
    ref.afterClosed().subscribe(result => {
      if (!isNullOrUndefined(result.idActividad)) {
        this.actividad.estadoActividad = result.estadoActividad;
      }
    });
  }

  getNombre(usuario: Usuario) {
    return `${usuario.nombre} ${usuario.apellido1}`;
  }

  canEditOrDelete(seguimiento: Seguimiento) {
    return this.auth.hasRole('ROLE_ADMIN') || this.curUser === seguimiento.usuarioSeguimiento.idUsuario;
  }

  editarSeguimiento(seguimiento: Seguimiento) {
    this.editSeguimiento = seguimiento;
    this.showForm = true;
  }

  eliminarSeguimiento(id: number) {
    const dialog: ConfirmDialogData = {
      title: 'Estás seguro de eliminar el Seguimiento?',
      message: 'Esta acción es irreversible. \n¿Estás seguro?',
      confirm: 'Sí, Eliminar'
    };
    this.uiService.showConfirm(dialog).afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteSeguimiento(this.idActividad, id).subscribe(exito => {
          if (exito) { this.datasource.data = this.datasource.data.filter(seguimiento => seguimiento.idSeguimiento !== id); }
        });
      }
    });
  }

  closeForm() {
    this.showForm = false;
    this.editSeguimiento = undefined;
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
