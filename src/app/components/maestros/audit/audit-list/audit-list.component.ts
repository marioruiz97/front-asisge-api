import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { UiService } from 'src/app/shared/ui.service';
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

  constructor(private service: AuditsService, private uiService: UiService) { }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetch() {
    this.listSub.push(
      this.service.fetchAll().subscribe(list => this.datasource.data = list.body as AuditData[],
        _ => this.uiService.showConfirm({ title: 'Error', message: 'No se encontraron registros', confirm: 'Ok' }))
    );
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.forEach(sub => sub.unsubscribe()); }
  }


}
