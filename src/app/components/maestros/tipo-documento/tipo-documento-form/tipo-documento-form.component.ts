import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoDocumentoService } from '../tipo-documento.service';

@Component({
  selector: 'app-tipo-documento-form',
  templateUrl: './tipo-documento-form.component.html',
  styleUrls: ['./tipo-documento-form.component.css']
})
export class TipoDocumentoFormComponent implements OnInit {

  private currentTipo: TipoDocumento;
  private currentId: string;
  tipoForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private service: TipoDocumentoService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {
        this.currentTipo = this.service.getById(id);
        this.currentId = id.toString();
      }
    });
    this.initForm();
  }

  initForm() {
    if (!this.currentTipo) { this.currentTipo = { idTipo: '', nombreTipo: '' }; }
    const tipo = { ...this.currentTipo };
    this.tipoForm = new FormGroup({
      idTipo: new FormControl({ value: tipo.idTipo, disabled: true }),
      nombreTipo: new FormControl(tipo.nombreTipo, [Validators.minLength(2), Validators.required])
    });
  }

  onSubmit() {
    if (this.currentId && this.currentId !== '') {
      const id = parseInt(this.currentId, 10);
      this.service.update(id, this.tipoForm.value);
    } else {
      this.service.create(this.tipoForm.value);
    }
  }

}
