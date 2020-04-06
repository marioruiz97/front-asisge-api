import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { TipoDocumentoService } from '../tipo-documento.service';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';


@Component({
  selector: 'app-tipo-documento-list',
  templateUrl: './tipo-documento-list.component.html',
  styleUrls: ['./tipo-documento-list.component.css']
})
export class TipoDocumentoListComponent implements OnInit, OnDestroy, AfterViewInit {

  private listSub: Subscription[] = [];
  displayedColumns = ['id', 'nombreTipoDocumento', 'acciones'];
  datasource = new MatTableDataSource<TipoDocumento>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: TipoDocumentoService, private uiService: UiService) { }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetch() {
    this.listSub.push(this.service.fetchAll().subscribe(list => this.datasource.data = list.body as TipoDocumento[],
      _ => this.uiService.showConfirm({ title: 'Error', message: 'No se encontraron registros', confirm: 'Ok' })
    ));
  }

  doFilter(filterString: string) {
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  delete(id: string) {
    this.listSub.push(this.service.delete(id).subscribe(res => {
      if (res) { this.fetch(); }
    }));
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.forEach(sub => sub.unsubscribe()); }
  }

}
