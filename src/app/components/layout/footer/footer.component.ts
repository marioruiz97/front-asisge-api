import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

export interface Item {
  name: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  isLogged = false;
  authSubscription: Subscription;

  proyectos: Item[];
  modulos: Item[];
  contacto: Item[];

  constructor(private authService: AuthService) {
    this.proyectos = [
      { name: 'Proyectos', url: '/' },
      { name: 'Informes', url: '/' },
      { name: 'Clientes', url: '/clientes' },
    ];
    this.modulos = [
      { name: 'Maestros', url: '/maestros' },
      { name: 'Usuarios', url: '/usuarios' },
      { name: 'Mi Perfil', url: '/micuenta' },
    ];
    this.contacto = [
      { name: 'Contacto', url: '/contacto' },
      { name: 'Manual de Usuario', url: '/' },
      { name: 'Acerca del Equipo', url: '/acerca' },
    ];
  }

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe(state => this.isLogged = state);
    this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    if (this.authSubscription) { this.authSubscription.unsubscribe(); }
  }

}
