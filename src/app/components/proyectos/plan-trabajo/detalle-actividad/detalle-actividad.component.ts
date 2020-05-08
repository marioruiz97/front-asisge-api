import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Actividad } from 'src/app/models/proyectos/actividad.model';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/terceros/usuario.model';

@Component({
  templateUrl: './detalle-actividad.component.html',
  styleUrls: ['./detalle-actividad.component.css']
})
export class DetalleActividadComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Actividad,
  ) { }

  ngOnInit() {
  }


  getName(user: Usuario) {
    return `${user.nombre} ${user.apellido1}`;
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
