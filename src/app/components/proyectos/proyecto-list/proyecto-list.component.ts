import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Proyecto } from 'src/app/models/proyectos/proyecto.model';
import { ProyectoService } from '../proyecto.service';
import { Subscription, Subject } from 'rxjs';
import { FilterData } from './filter/filter.component';

@Component({
  selector: 'app-proyecto-list',
  templateUrl: './proyecto-list.component.html',
  styleUrls: ['./proyecto-list.component.css']
})
export class ProyectoListComponent implements OnInit, OnDestroy {

  showFilters = false;
  quitarFiltros = false;
  date = new Date();
  proyectos = new Subject<Proyecto[]>();
  private allProyectos: Proyecto[] = [];
  private subs: Subscription[] = [];

  constructor(private authService: AuthService, private service: ProyectoService) { }

  ngOnInit() {
    this.fetchProyectos();
  }

  fetchProyectos() {
    this.subs.push(this.service.fetchProyectos().subscribe(res => {
      this.allProyectos = res.body as Proyecto[];
      this.proyectos.next(this.allProyectos);
    }));
  }

  filtrar(filtros: FilterData) {
    const result = this.allProyectos.filter(pr => {
      const razon = pr.cliente.razonSocial.trim().toLowerCase();
      const cliente = filtros.cliente ? filtros.cliente.trim().toLowerCase() : undefined;

      const filtro1 = !(cliente && !razon.includes(cliente));
      const filtro2 = !(filtros.estado && !(filtros.estado === pr.estadoProyecto.id));
      const filtro3 = !(filtros.desde && new Date(pr.createdDate) < filtros.desde);
      const filtro = filtro1 && filtro2 && filtro3;
      if (filtro) {
        return pr;
      }
    }).slice();
    this.quitarFiltros = true;
    this.proyectos.next(result);
  }

  eliminarFiltros() {
    this.quitarFiltros = false;
    this.showFilters = false;
    this.proyectos.next(this.allProyectos);
  }

  redirect(to: string) {
    return this.authService.redirect(to);
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(s => s.unsubscribe()); }
  }
}
