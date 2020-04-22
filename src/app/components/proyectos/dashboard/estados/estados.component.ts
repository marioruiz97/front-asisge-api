import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { EstadoProyecto } from 'src/app/models/proyectos/proyecto.model';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styles: [
    '.bold{ font-weight: 500; }'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstadosComponent implements OnInit {

  @Input() estado: EstadoProyecto;

  constructor() { }

  ngOnInit() {
  }

}
