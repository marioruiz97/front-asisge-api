import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { ClienteService } from '../cliente.service';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit, AfterViewInit, OnDestroy {

  private listSub: Subscription[] = [];
  displayedColumns = ['idCliente', 'identificacion', 'nombreComercial', 'contactos', 'acciones'];
  datasource = new MatTableDataSource<Cliente>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: ClienteService, private uiService: UiService) { }

  ngOnInit() {
    this.fetch();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  fetch() {
    this.listSub.push(
      this.service.fetchAll().subscribe(list => this.datasource.data = list.body as Cliente[],
        _ => this.uiService.showConfirm({ title: 'Error', message: 'No se encontraron registros', confirm: 'Ok' }))
    );
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
