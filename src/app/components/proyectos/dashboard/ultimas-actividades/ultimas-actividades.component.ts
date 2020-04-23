import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Notificacion } from 'src/app/models/proyectos/dashboard.model';
import { DashboardService } from '../dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ultimas-actividades',
  templateUrl: './ultimas-actividades.component.html',
  styleUrls: ['./ultimas-actividades.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UltimasActividadesComponent implements OnInit, OnDestroy {

  notificaciones: Notificacion[] = [];
  private subs: Subscription[] = [];

  constructor(private service: DashboardService) { }

  ngOnInit() {
    this.subs.push(this.service.notificaciones.subscribe(list => this.notificaciones = list));
    this.service.fetchNotificaciones();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
