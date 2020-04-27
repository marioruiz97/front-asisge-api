import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Subject } from 'rxjs';
import { Miembros, Proyecto, EstadoLineDto } from 'src/app/models/proyectos/proyecto.model';
import { AppService } from 'src/app/shared/app.service';
import { Dashboard, Notificacion } from 'src/app/models/proyectos/dashboard.model';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { UiService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Injectable()
export class DashboardService {

  dashboard: Dashboard;
  cliente = new Subject<Cliente>();
  miembros = new Subject<Miembros[]>();
  proyecto = new Subject<Proyecto>();
  notificaciones = new Subject<Notificacion[]>();
  estados = new Subject<EstadoLineDto[]>();

  private dashboardPath = Cons.PATH_DASHBOARD;

  constructor(private appService: AppService, private uiService: UiService, private router: Router) { }

  fetchDashboard(idDashboard: number) {
    this.uiService.loadingState.next(true);
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

  setDashboardProperties(dashboard: Dashboard) {
    this.cliente.next(dashboard.cliente);
    this.miembros.next(dashboard.miembros);
    this.proyecto.next(dashboard.proyecto);
    this.notificaciones.next(dashboard.notificaciones);
    this.uiService.loadingState.next(false);
  }

  fetchInfoCliente(idDashboard: number) {
    if (this.dashboard && this.dashboard.cliente) {
      this.cliente.next(this.dashboard.cliente);
    }
  }

  fetchInfoProyecto(idDashboard: number) {
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

  returnToList() {
    this.router.navigate(['/proyectos']);
  }

}
