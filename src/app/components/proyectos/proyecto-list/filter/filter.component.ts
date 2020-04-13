import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EstadoProyecto } from 'src/app/models/proyectos/proyecto.model';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { EstadoProyectoService } from 'src/app/components/maestros/estados-proyectos/estado-proyecto.service';
import { ClienteService } from 'src/app/components/terceros/clientes/cliente.service';


export interface FilterData {
  estado: number;
  cliente: string;
  desde: Date;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  estados: EstadoProyecto[] = [];
  clientes: Cliente[] = [];
  filteredClientes: Observable<Cliente[]>;
  form: FormGroup;
  maxDate = new Date();

  @Output() filtrar = new EventEmitter();
  private subs: Subscription[] = [];

  constructor(
    private estadosService: EstadoProyectoService,
    private clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.initForm();
    this.fetchClientes();
    this.fetchEstados();
    this.filteredClientes = this.form.get('cliente').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filter(value) : this.clientes.slice())
    );
  }

  fetchClientes() {
    this.subs.push(this.clienteService.fetchAll().subscribe(res => this.clientes = res.body as Cliente[]));
  }

  fetchEstados() {
    this.subs.push(this.estadosService.fetchAll().subscribe(res => this.estados = res.body as EstadoProyecto[]));
  }

  initForm() {
    this.form = new FormGroup({
      estado: new FormControl(),
      cliente: new FormControl(''),
      desde: new FormControl(new Date())
    });
  }

  private _filter(value: string): Cliente[] {
    const filterValue = value.trim().toLowerCase();
    return this.clientes.filter(c =>
      c.razonSocial.toLowerCase().includes(filterValue) || c.nombreComercial.toLowerCase().includes(filterValue)
    ).slice();
  }

  onFilter() {
    this.filtrar.emit(this.form.value);
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(s => s.unsubscribe()); }
  }

}
