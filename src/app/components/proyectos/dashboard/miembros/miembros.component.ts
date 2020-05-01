import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Miembros } from 'src/app/models/proyectos/proyecto.model';
import { DashboardService } from '../dashboard.service';
import { Usuario } from 'src/app/models/terceros/usuario.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.component.html',
  styleUrls: ['./miembros.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiembrosComponent implements OnInit, OnDestroy {

  miembros: Miembros[] = [];
  miUsuario: Usuario;
  miRol: string;
  private subs: Subscription[] = [];

  constructor(
    private service: DashboardService, private authService: AuthService, private detector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.subs.push(this.authService.currentUser.subscribe(tokenInfo => {
      const idUsuario = tokenInfo ? tokenInfo.userid : 0;
      this.subs.push(this.service.miembros.subscribe(list => {
        const miembro = list.find(user => user.usuario.idUsuario === idUsuario);
        if (miembro) {
          this.miUsuario = miembro.usuario;
          this.miRol = miembro.rolProyecto;
        }
        this.miembros = list.filter(user => user.usuario.idUsuario !== idUsuario);
        this.detector.markForCheck();
      }));
      this.service.fetchMiembros();
    }));
    this.authService.initAuth();
  }

  getNombre() {
    if (this.miUsuario) {
      return `${this.miUsuario.nombre} ${this.miUsuario.apellido1}`;
    }
  }

  getMiembroName(miembro: Miembros) {
    const user = miembro.usuario;
    return `${user.nombre} ${user.apellido1}`;
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
