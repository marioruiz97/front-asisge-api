import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { EtapaPlan } from 'src/app/models/proyectos/plan-trabajo.model';
import { PlanTrabajoService } from '../plan-trabajo.service';


@Component({
  selector: 'app-etapas-plan',
  templateUrl: './etapas-plan.component.html',
  styleUrls: ['./etapas-plan.component.css']
})
export class EtapasPlanComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['idEtapaPDT', 'nombreEtapa', 'fechaInicio', 'fechaFin'];
  datasource = new MatTableDataSource<EtapaPlan>();

  private subs: Subscription[] = [];

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: PlanTrabajoService) { }


  ngOnInit() {
    this.subs.push(this.service.etapasSubject.subscribe(etapas => this.datasource.data = etapas));
    this.service.fetchEtapas();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
