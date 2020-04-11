import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Proyecto } from 'src/app/models/proyectos/proyecto.model';
import { Subscription } from 'rxjs';
import { CuentaService } from '../cuenta.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-mis-proyectos',
  templateUrl: './mis-proyectos.component.html',
  styleUrls: ['./mis-proyectos.component.css']
})
export class MisProyectosComponent implements OnInit, OnDestroy {

  misProyectos: Proyecto[] = [];
  private subs: Subscription[] = [];
  @Input() private idUsuario: number;

  constructor(private service: CuentaService, private authService: AuthService) { }

  ngOnInit() {
    this.subs.push(this.service.fetchMisProyectos(this.idUsuario).subscribe(res => this.misProyectos = res.body as Proyecto[]));
  }

  hasRole(roles: string[]): boolean {
    const result = this.authService.hasRoles(roles);
    return result;
  }


  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
