import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PlantillaActividad } from 'src/app/models/proyectos/plantilla.model';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-actividad-list',
  templateUrl: './actividad-list.component.html',
  styleUrls: ['./actividad-list.component.css']
})
export class ActividadListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['nombre', 'duracion', 'acciones'];
  datasource = new MatTableDataSource<PlantillaActividad>();
  private subs: Subscription[] = [];

  @Input() observable: Subject<PlantillaActividad[]>;
  @Output() edit = new EventEmitter<PlantillaActividad>();
  @Output() delete = new EventEmitter<PlantillaActividad>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  /* @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; */

  constructor() { }

  ngOnInit() {
    this.subs.push(this.observable.subscribe(actividades => this.datasource.data = actividades));
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    /* this.datasource.paginator = this.paginator; */
  }

  $edit(actividad: PlantillaActividad) {
    this.edit.emit(actividad);
  }

  $delete(actividad: PlantillaActividad) {
    this.delete.emit(actividad);
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
