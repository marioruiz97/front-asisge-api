import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { EditarEtapaComponent } from '../editar-etapa/editar-etapa.component';
import { DIALOG_CONFIG } from 'src/app/shared/routing/app.constants';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-etapas-plan',
  templateUrl: './etapas-plan.component.html',
  styleUrls: ['./etapas-plan.component.css']
})
export class EtapasPlanComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['idEtapaPDT', 'nombreEtapa', 'fechaInicio', 'fechaFin', 'acciones'];
  datasource = new MatTableDataSource<EtapaPlan>();

  private subs: Subscription[] = [];

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: PlanTrabajoService, private dialog: MatDialog) { }


  ngOnInit() {
    this.subs.push(this.service.planActualSubject.subscribe(plan => this.datasource.data = plan.planDeTrabajo.etapas));
    this.service.fetchPlanActual();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  editEtapa(etapa: EtapaPlan) {
    const ref = this.dialog.open(EditarEtapaComponent, { ...DIALOG_CONFIG, data: etapa });
    // recibir la etapa modificada
    ref.afterClosed().subscribe(result => {
      if (!isNullOrUndefined(result.idEtapaPDT) && result.idEtapaPDT !== 0) {
        this.datasource.data.filter(e => e.idEtapaPDT === result.idEtapaPDT).map(et => {
          et.nombreEtapa = result.nombreEtapa;
          et.fechaFin = result.fechaFin;
          et.fechaInicio = result.fechaInicio;
        });
      }
    });
  }

  deleteEtapa(idEtapa: number) {
    this.service.deleteEtapa(idEtapa);
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
