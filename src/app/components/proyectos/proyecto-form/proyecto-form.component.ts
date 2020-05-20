import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { ClienteService } from '../../terceros/clientes/cliente.service';
import { UiService } from 'src/app/shared/ui.service';
import { ProyectoService } from '../proyecto.service';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { EstadoProyecto, Proyecto } from 'src/app/models/proyectos/proyecto.model';

@Component({
  selector: 'app-proyecto-form',
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.css']
})
export class ProyectoFormComponent implements OnInit, OnDestroy {

  proyectoForm: FormGroup;
  clientes: Cliente[] = [];
  filteredClientes: Observable<Cliente[]>;
  isWaiting = false;
  minDate = new Date();

  isUpdate = false;
  estados: EstadoProyecto[] = [];
  private curProjectId: number;
  private clienteId: number;
  private subs: Subscription[] = [];

  constructor(
    private clienteService: ClienteService,
    private uiService: UiService,
    private service: ProyectoService,
    private activatedRoute: ActivatedRoute
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
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.curProjectId = id;
        this.getProyecto(id);
      }
    }));
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

  private fetchEstados(estado: EstadoProyecto) {
    this.proyectoForm.get('estadoProyecto').enable();
    this.subs.push(this.service.fetchEstados(estado.id).subscribe(res => {
      this.estados = res.body;
      this.estados.push(estado);
    }));
  }

  private getProyecto(id: number) {
    this.service.getProyecto(id)
      .then(res => {
        this.setForm(res.body);
      })
      .catch(err => {
        this.service.showNotFound(err);
        this.service.gotoDashboard(id);
      });
  }

  private setForm(proyecto: Proyecto) {
    this.fetchEstados(proyecto.estadoProyecto);
    this.isUpdate = true;
    this.clienteId = proyecto.cliente.idCliente;
    this.proyectoForm.setValue({
      nombreProyecto: proyecto.nombreProyecto,
      descripcionGeneral: proyecto.descripcionGeneral,
      fechaCierreProyecto: proyecto.fechaCierreProyecto,
      estadoProyecto: proyecto.estadoProyecto.id,
      cliente: this.setClienteValue(proyecto.cliente)
    });
    this.proyectoForm.get('cliente').disable();
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
    if (this.isUpdate) {
      this.service.editarProyecto(this.curProjectId, { ...this.proyectoForm.value, cliente: this.clienteId });
    } else {
      const cliente: string = this.proyectoForm.value.cliente;
      const idCliente = cliente.substring(0, cliente.indexOf('-')).trim();
      this.proyectoForm.value.cliente = parseInt(idCliente, 10);
      this.service.crearProyecto(this.proyectoForm.value);
    }
  }

  goBack() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isUpdate) {
          this.service.gotoDashboard(this.curProjectId);
        } else {
          this.service.returnToList();
        }
      }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
