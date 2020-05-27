import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Subject } from 'rxjs';
import { Miembros, Proyecto, EstadoLineDto, MiembroDto } from 'src/app/models/proyectos/proyecto.model';
import { AppService } from 'src/app/shared/app.service';
import { Dashboard, Notificacion } from 'src/app/models/proyectos/dashboard.model';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { UiService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { Actividad } from 'src/app/models/proyectos/actividad.model';

@Injectable()
export class DashboardService {

  dashboard: Dashboard;
  cliente = new Subject<Cliente>();
  miembros = new Subject<Miembros[]>();
  proyecto = new Subject<Proyecto>();
  notificaciones = new Subject<Notificacion[]>();
  estados = new Subject<EstadoLineDto[]>();
  proximasActividades = new Subject<Actividad[]>();

  private dashboardPath = Cons.PATH_DASHBOARD;

  constructor(
    private appService: AppService,
    private uiService: UiService,
    private router: Router
  ) { }

  fetchDashboard(idDashboard: number) {
    this.uiService.dashboardLoading.next(true);
    if (this.dashboard && this.dashboard.idDashboard && this.dashboard.idDashboard === idDashboard) {
      this.setDashboardProperties(this.dashboard);
    } else {
      this.appService.getRequest(`${this.dashboardPath}/${idDashboard}`).subscribe(res => {
        this.dashboard = res.body as Dashboard;
        this.setDashboardProperties(this.dashboard);
      }, _ => {
        this.uiService.showConfirm({
          title: 'Dashboard no encontrado', confirm: 'Ok',
          message: 'No se ha podido obtener la información del dashboard'
        });
        this.returnToList();
      });
    }
  }

  recargarDashboard() {
    if (this.dashboard && this.dashboard.idDashboard) {
      this.uiService.dashboardLoading.next(true);
      const idDashboard = this.dashboard.idDashboard;
      this.appService.getRequest(`${this.dashboardPath}/${idDashboard}`).subscribe(res => {
        this.dashboard = res.body as Dashboard;
        this.setDashboardProperties(this.dashboard);
      });
    }
  }

  setDashboardProperties(dashboard: Dashboard) {
    this.cliente.next(dashboard.cliente);
    this.miembros.next(dashboard.miembros);
    this.proyecto.next(dashboard.proyecto);
    this.proximasActividades.next(dashboard.proximasActividades);
    if (!dashboard.proximasActividades) {
      this.alertarProyecto('');
    }
    this.notificaciones.next(dashboard.notificaciones);
    this.uiService.dashboardLoading.next(false);
  }

  fetchInfoCliente() {
    if (this.dashboard && this.dashboard.cliente) {
      this.cliente.next(this.dashboard.cliente);
    }
  }

  fetchInfoProyecto() {
    if (this.dashboard && this.dashboard.proyecto) {
      this.proyecto.next(this.dashboard.proyecto);
    }
  }

  fetchMiembros() {
    if (this.dashboard && this.dashboard.miembros) {
      this.miembros.next(this.dashboard.miembros);
    }
  }

  fetchNotificaciones() {
    if (this.dashboard && this.dashboard.notificaciones) {
      this.notificaciones.next(this.dashboard.notificaciones);
    }
  }

  fetchEstadosLine() {
    if (this.dashboard && this.dashboard.lineaEstados) {
      this.estados.next(this.dashboard.lineaEstados);
    }
  }

  fetchProximasActividades() {
    if (this.dashboard && this.dashboard.proximasActividades) {
      this.proximasActividades.next(this.dashboard.proximasActividades);
    }
  }
  /**
   * FIN DE METODOS DE PROPIEDADES BASICAS DEL DASHBOARD, DE AQUI EN ADELANTE SE ENCUENTRA METODOS ESPECIFICOS DE LA GESTION DE CADA PARTE
   */

  /**
   * METODOS USADOS EN LA DESTION DE MIEMBROS
   */
  fetchPosiblesMiembros() {
    const posiblesMiembros = Cons.PATH_POSIBLES_MIEMBROS;
    if (this.dashboard && this.dashboard.idDashboard) {
      return this.appService.getRequest(`${posiblesMiembros}/${this.dashboard.idDashboard}`);
    }
  }

  crearMiembro(miembro: MiembroDto) {
    const path = Cons.PATH_PROYECTO_MIEMBROS.replace('{idProyecto}', miembro.proyecto.toString());
    return this.appService.postRequest(path, miembro);
  }

  eliminarMiembro(miembro: Miembros) {
    const path = Cons.PATH_PROYECTO_MIEMBROS.replace('{idProyecto}', miembro.proyecto.idProyecto.toString());
    this.appService.deleteRequest(path + '?miembro=' + miembro.idMiembroProyecto).then(res => {
      this.uiService.showSnackBar(res.message, 3);
      this.dashboard.miembros = this.dashboard.miembros.filter(old => old.idMiembroProyecto !== miembro.idMiembroProyecto);
      this.fetchMiembros();
    }).catch(err => this.uiService.showSnackBar(err.error.message, 3));
  }

  agregarMiembroLista(miembro: Miembros) {
    this.dashboard.miembros.push(miembro);
    this.fetchMiembros();
  }
  /**
   *  FIN METODOS DE GESTION DE MIEMBROS
   */

  alertarProyecto(message: string, actividades: boolean = false) {
    let checkArchivos = true;
    if (this.dashboard.proyecto && (this.dashboard.proyecto.anticipo || this.dashboard.proyecto.contrato)) {
      checkArchivos = false;
    }
    if (checkArchivos && actividades) {
      const errors = [message, 'No se ha cargado anticipo o contrato para el proyecto'];
      this.uiService.showConfirm({
        title: 'Alertas en el proyecto', errors,
        message: 'Debe revisar las próximas actividades y los archivos del proyecto', confirm: 'Ok'
      });
    } else if (checkArchivos && !actividades) {
      this.uiService.showConfirm({
        title: 'Proyecto iniciado sin anticipo o contrato', confirm: 'Ok',
        message: 'No se ha cargado anticipo o contrato para el proyecto'
      });
    } else if (!checkArchivos && actividades) {
      this.uiService.showConfirm({ title: 'Hay actividades vencidas', message, confirm: 'Ok' });
    }
  }

  cargarContrato(archivo: File, idProyecto: number) {
    const path = Cons.PATH_PROYECTOS + `/${idProyecto}?contrato=${true}`;
    return this.appService.uploadFile(archivo, path);
  }

  cargarAnticipo(archivo: File, idProyecto: number) {
    const path = Cons.PATH_PROYECTOS + `/${idProyecto}?contrato=${false}`;
    return this.appService.uploadFile(archivo, path);
  }

  returnToList() {
    this.router.navigate(['/proyectos']);
  }

}
