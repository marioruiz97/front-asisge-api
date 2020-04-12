import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AuditsService } from '../audits.service';

export interface AuditData {
  idAuditoria: string | number;
  emailUsuario: string;
  fechaAccion: Date;
  accionRealizada: string;
  descripcionAccion: string;
}

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['../../maestros.css']
})
export class AuditListComponent implements OnInit, AfterViewInit, OnDestroy {

  private listSub: Subscription[] = [];
  displayedColumns = ['emailUsuario', 'accionRealizada', 'descripcionAccion', 'fechaAccion'];
  datasource = new MatTableDataSource<AuditData>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: AuditsService) { }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetch() {
    this.listSub.push(
      this.service.fetchAll().subscribe(list => this.datasource.data = list.body as AuditData[]));
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.forEach(sub => sub.unsubscribe()); }
  }


}
