import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { ClienteService } from '../../terceros/clientes/cliente.service';
import { UiService } from 'src/app/shared/ui.service';
import { ProyectoService } from '../proyecto.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-proyecto-form',
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.css']
})
export class ProyectoFormComponent implements OnInit, OnDestroy {

  proyectoForm: FormGroup;
  clientes: Cliente[] = [];
  filteredClientes: Observable<Cliente[]>;

  minDate = new Date();

  private subs: Subscription[] = [];

  constructor(
    private clienteService: ClienteService,
    private uiService: UiService,
    private service: ProyectoService
  ) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit() {
    this.initForm();
    this.fetchClientes();
    this.filteredClientes = this.proyectoForm.get('cliente').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filter(value) : this.clientes.slice())
    );
  }

  private initForm() {
    this.proyectoForm = new FormGroup({
      nombreProyecto: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      descripcionGeneral: new FormControl('', Validators.maxLength(255)),
      fechaCierreProyecto: new FormControl(this.minDate, Validators.required),
      estadoProyecto: new FormControl({ value: 1, disabled: true }),
      cliente: new FormControl('', Validators.required),
    });
  }

  private fetchClientes() {
    this.subs.push(this.clienteService.fetchAll().subscribe(res => this.clientes = res.body,
      err => {
        const data = {
          title: 'No se han encontrado clientes',
          message: 'Al parecer no tienes clientes asociados, primero debes ir a crearlos en el maestro de clientes. '
            + '\n ¿Quieres ser redireccionado allí?',
          confirm: 'Sí, llevame allí'
        };
        this.subs.push(this.uiService.showConfirm(data).afterClosed().subscribe(result => {
          if (result) {
            this.service.gotoClientes();
          }
        }));
      }
    ));
  }

  setClienteValue(cliente: Cliente) {
    return `${cliente.idCliente} - ${cliente.razonSocial}`;
    /* const value = `${cliente.idCliente} - ${cliente.nombreComercial}`;
    this.proyectoForm.get('cliente').setValue(value); */
  }

  private _filter(value: string): Cliente[] {
    const filterValue = value.trim().toLowerCase();
    return this.clientes.filter(c =>
      c.razonSocial.toLowerCase().includes(filterValue) || c.nombreComercial.toLowerCase().includes(filterValue)
    ).slice();
  }


  onSubmit() {
    const cliente: string = this.proyectoForm.value.cliente;
    const idCliente = cliente.substring(0, cliente.indexOf('-')).trim();
    this.proyectoForm.value.cliente = parseInt(idCliente, 10);
    this.service.crearProyecto(this.proyectoForm.value);
  }

  goBack() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) { this.service.returnToList(); }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
