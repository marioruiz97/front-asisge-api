import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../cliente.service';
import { UiService } from 'src/app/shared/ui.service';
import { Cliente, Contacto } from 'src/app/models/terceros/cliente.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ContactoFormComponent } from '../contacto-form/contacto-form.component';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit, OnDestroy {

  clienteForm: FormGroup;
  tiposDoc: TipoDocumento[] = [];
  contactos: Contacto[] = [];
  private subscriptions: Subscription[] = [];
  private $isUpdate = false;
  private curId: number;

  constructor(
    private service: ClienteService, private activatedRoute: ActivatedRoute,
    private uiService: UiService, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchDocumentos();
    this.initForm();
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.getCliente(id);
      }
    }));
  }

  fetchDocumentos() {
    this.subscriptions.push(this.service.fetchTiposDoc().subscribe(res => this.tiposDoc = res.body));
  }

  initForm() {
    this.clienteForm = new FormGroup({
      idCliente: new FormControl({ value: '', disabled: true }),
      identificacion: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      nombreComercial: new FormControl('', [Validators.required]),
      razonSocial: new FormControl('', [Validators.required]),
      tipoDocumento: new FormControl('', [Validators.required]),
    });
  }

  getCliente(id: number | string) {
    this.service.getById(id)
      .then(res => this.setForm(res.body))
      .catch(err => {
        this.service.returnToList();
        const message = err.error ? err.error.message : 'Ha ocurrido un error. Intenta nuevamente';
        this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
      });
  }
  setForm(cliente: Cliente) {
    const tipoDoc = cliente.tipoDocumento as TipoDocumento;
    this.contactos = cliente.contactos;
    this.contactos.forEach(c => c.idCliente = cliente.idCliente);
    this.refrescarContactos();
    this.clienteForm.setValue({
      idCliente: cliente.idCliente, identificacion: cliente.identificacion,
      nombreComercial: cliente.nombreComercial, razonSocial: cliente.razonSocial,
      tipoDocumento: tipoDoc.id
    });
    this.$isUpdate = true;
    this.curId = cliente.idCliente;
  }

  goBack() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.returnToList();
      }
    }));
  }

  get isUpdate() {
    return this.$isUpdate;
  }

  onSubmit() {
    if (this.$isUpdate && this.curId && this.curId !== 0) {
      this.service.update(this.curId, { ...this.clienteForm.value, contactos: this.contactos });
    } else {
      this.service.create({ ...this.clienteForm.value, contactos: this.contactos });
    }
  }


  /**
   * metodos para contactos
   */
  refrescarContactos() {
    this.service.contactosChanged.next(this.contactos);
  }

  agregarContacto() {
    const data: Contacto = {
      id: 0, idCliente: this.clienteForm.value.idCliente,
      correo: '', telefono: '', nombre: ''
    };
    const dialogRef = this.dialog.open(ContactoFormComponent, { disableClose: true, data });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.id = result.id !== 0 ? result.id : this.contactos.length;
        this.contactos.push(result);
        this.refrescarContactos();
      }
    }));
  }

  editarContacto(contacto: Contacto) {
    const dialogRef = this.dialog.open(ContactoFormComponent, { disableClose: true, data: contacto });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactos = this.contactos.filter(c => c.id !== result.id);
        this.contactos.push(result);
        this.refrescarContactos();
      }
    }));
  }

  deleteContacto(id: number) {
    this.contactos = this.contactos.filter(c => c.id !== id);
    this.refrescarContactos();
  }

  ngOnDestroy() {
    if (this.subscriptions) { this.subscriptions.forEach(sub => sub.unsubscribe()); }
  }
}
