import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { EstadoProyecto, EstadoLineDto } from 'src/app/models/proyectos/proyecto.model';
import { DashboardService } from '../dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styles: [
    '.bold{ font-weight: 500; }'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstadosComponent implements OnInit, OnDestroy {

  @Input() estado: EstadoProyecto;
  avance = 5;
  estadosLine: EstadoLineDto[] = [];
  private subs: Subscription[] = [];

  constructor(private service: DashboardService) { }

  ngOnInit() {
    this.fetchLine();
  }

  fetchLine() {
    this.subs.push(this.service.estados.subscribe(list => this.estadosLine = list));
    this.subs.push(this.service.avance.subscribe(avance => this.avance = avance));
    this.service.fetchEstadosLine();
    this.service.fetchAvances();
  }

  refreshIndex(): number {
    let index = 0;
    if (this.estadosLine.length > 0) {
      index = this.estadosLine.findIndex(estado => estado.actual);
    }
    return index === -1 ? 0 : index;
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
