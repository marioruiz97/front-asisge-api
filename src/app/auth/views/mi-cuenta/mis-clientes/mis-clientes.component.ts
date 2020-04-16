import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Subscription } from 'rxjs';
import { CuentaService } from '../cuenta.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-mis-clientes',
  templateUrl: './mis-clientes.component.html',
  styleUrls: ['./mis-clientes.component.css']
})
export class MisClientesComponent implements OnInit, OnDestroy {

  misClientes: Cliente[] = [];
  private subs: Subscription[] = [];
  private hadRole = false;
  @Input() private idUsuario: number;

  constructor(private service: CuentaService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchMisClientes();
  }

  fetchMisClientes() {
    this.subs.push(this.service.fetchMisClientes(this.idUsuario).subscribe(res => this.misClientes = res.body as Cliente[]));
  }

  hasRoles(roles: string[]) {
    if (!this.hadRole) {
      this.hadRole = this.authService.hasRoles(roles);
    }
    return this.hadRole;
  }

  quitarCliente(idCliente: number) {
    this.subs.push(this.service.quitarCliente(idCliente, this.idUsuario).subscribe(exito => {
      if (exito) { this.fetchMisClientes(); }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
