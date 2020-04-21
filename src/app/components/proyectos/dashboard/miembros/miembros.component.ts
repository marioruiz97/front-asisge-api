import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.component.html',
  styleUrls: ['./miembros.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiembrosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
