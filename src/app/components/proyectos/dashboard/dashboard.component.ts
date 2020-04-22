import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Proyecto } from 'src/app/models/proyectos/proyecto.model';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  cliente: Cliente;
  proyecto: Proyecto;
  isWaiting = true;
  private subs: Subscription[] = [];

  constructor(
    private service: DashboardService, private activatedRoute: ActivatedRoute, private uiService: UiService
  ) { }

  ngOnInit() {
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.service.cliente.subscribe(cliente => this.cliente = cliente));
    this.subs.push(this.service.proyecto.subscribe(proyecto => this.proyecto = proyecto));
    this.subs.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.service.fetchDashboard(id);
      }
    }));
  }

  returnIdentificacion() {
    if (this.cliente) {
      return `${this.cliente.tipoDocumento.nombreTipoDocumento}: ${this.cliente.identificacion}`;
    }
  }


  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
