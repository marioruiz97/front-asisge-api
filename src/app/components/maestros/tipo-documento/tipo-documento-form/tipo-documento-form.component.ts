import { Component, OnInit, OnDestroy } from '@angular/core';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TipoDocumentoService } from '../tipo-documento.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tipo-documento-form',
  templateUrl: './tipo-documento-form.component.html',
  styleUrls: ['./tipo-documento-form.component.css']
})
export class TipoDocumentoFormComponent implements OnInit, OnDestroy {

  currentId: string;
  tipoForm: FormGroup;
  private subs: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute, private service: TipoDocumentoService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.getTipo(id);
      }
    });
    this.initForm();
  }

  initForm() {
    this.tipoForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      nombreTipoDocumento: new FormControl('', [Validators.minLength(2), Validators.required])
    });
  }

  getTipo(id: string | number) {
    this.service.getById(id)
      .then(res => this.setTipo(res.body))
      .catch(err => {
        this.service.returnToList(true);
        const message = err.error ? err.error.message : 'Ha ocurrido un error. Intenta nuevamente';
        this.service.showPopUp({ title: 'Error', message, confirm: 'Ok' });
      });
  }

  setTipo(tipo: TipoDocumento) {
    this.currentId = tipo.id;
    this.tipoForm.setValue({ id: tipo.id, nombreTipoDocumento: tipo.nombreTipoDocumento });
  }

  goBack() {
    this.service.returnToList();
  }

  onSubmit() {
    if (this.currentId && this.currentId !== '') {
      this.service.update(this.currentId, this.tipoForm.value);
    } else {
      this.service.create(this.tipoForm.value);
    }
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
