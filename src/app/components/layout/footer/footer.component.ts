import { Component, OnInit } from '@angular/core';

export interface Item {
  name: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  isLogged = true;

  proyectos: Item[];
  modulos: Item[];
  contacto: Item[];

  constructor() {
    this.proyectos = [
      { name: 'Proyectos', url: '/' },
      { name: 'Informes', url: '/' },
      { name: 'Clientes', url: '/' },
    ];
    this.modulos = [
      { name: 'Maestros', url: '/' },
      { name: 'Usuarios', url: '/' },
      { name: 'Mi Perfil', url: '/' },
    ];
    this.contacto = [
      { name: 'Contacto', url: '/' },
      { name: 'Manual de Usuario', url: '/' },
      { name: 'Acerca del Equipo', url: '/' },
    ];
  }

  ngOnInit() {
  }

}
