import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {


  equipo = [
    { nombre: 'Mario Andrés Ruiz', cargo: 'Analista/Desarrollador', class: 'fab-icon mario-photo' },
    { nombre: 'Juliana Correa Zapata', cargo: 'Analista/Desarrollador', class: 'fab-icon juliana-photo' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
