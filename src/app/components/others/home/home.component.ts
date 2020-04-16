import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cards = [
    {
      avatar: 'next_week', title: 'Proyectos', subtitle: 'Gestiona los proyectos de los diferentes clientes',
      img: '/assets/img/home-proyectos.png', content: '', button: 'Ir a proyectos', urlTo: '/proyectos'
    },
    {
      avatar: 'assessment', title: 'Informes', subtitle: 'Genera informes de estado de proyecto y demás',
      img: '/assets/img/home-informes.png', content: '', button: 'Ir a informes', urlTo: '/'
    },
    {
      avatar: 'people_outline', title: 'Clientes', subtitle: 'Gestiona la información de clientes',
      img: '/assets/img/home-clientes.jpeg', content: '', button: 'Ir a clientes', urlTo: '/clientes'
    },
    {
      avatar: 'assignment_ind', title: 'Usuarios', subtitle: 'Gestiona a los diferentes usuarios',
      img: '/assets/img/home-usuarios.jpeg', content: '', button: 'Ir a usuarios', urlTo: '/usuarios'
    },
    {
      avatar: 'work_outline', title: 'Maestros', subtitle: 'Gestiona los diferentes maestros del aplicativo',
      img: '/assets/img/home-maestros.jpg', content: '', button: 'Ir a maestros', urlTo: '/maestros'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
