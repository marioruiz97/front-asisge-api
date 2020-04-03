import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../cliente.service';
import { UiService } from 'src/app/shared/ui.service';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit, OnDestroy {

  clienteForm: FormGroup;
  tiposDoc: TipoDocumento[] = [];
  private docsSub: Subscription;
  private $isUpdate = false;


  constructor(
    private service: ClienteService, private activatedRoute: ActivatedRoute,
    private uiService: UiService, private router: Router
  ) { }

  ngOnInit() {
    this.fetchDocumentos();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.getCliente(id);
      }
    });
    this.initForm();
  }

  fetchDocumentos() {
    this.docsSub = this.service.fetchTiposDoc().subscribe(res => this.tiposDoc = res.body);
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
        this.router.navigate(['/clientes']);
        const message = err.error ? err.error.message : 'Ha ocurrido un error. Intenta nuevamente';
        this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
      });
  }
  setForm(cliente: Cliente) {
    const tipoDoc = cliente.tipoDocumento as TipoDocumento;
    this.clienteForm.setValue({
      idCliente: cliente.idCliente, identificacion: cliente.identificacion,
      nombreComercial: cliente.nombreComercial, razonSocial: cliente.razonSocial,
      tipoDocumento: tipoDoc.id
    });
  }

  goBack(skip: boolean = false) {
    if (skip) {
      this.router.navigate(['/clientes']);
    } else {
      const data = {
        title: '¿Cancelar progreso?',
        message: 'Si vuelves perderás los avances del formulario de ingreso',
        confirm: 'Sí, deseo regresar'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/clientes']);
        }
      });
    }
  }

  get isUpdate() {
    return this.$isUpdate;
  }

  onSubmit() {
    const id = this.clienteForm.value.idCliente;
    if (this.$isUpdate && id && id !== '') {
      this.service.update(id, this.clienteForm.value);
    } else {
      this.service.create(this.clienteForm.value);
    }
    this.goBack(true);
  }

  ngOnDestroy() {
    if (this.docsSub) { this.docsSub.unsubscribe(); }
  }
}
