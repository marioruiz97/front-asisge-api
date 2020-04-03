import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TipoDocumentoService } from '../tipo-documento.service';

@Component({
  selector: 'app-tipo-documento-form',
  templateUrl: './tipo-documento-form.component.html',
  styleUrls: ['./tipo-documento-form.component.css']
})
export class TipoDocumentoFormComponent implements OnInit, AfterContentChecked {

  currentId: string;
  private validTipo: boolean;
  tipoForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private service: TipoDocumentoService) { }

  ngAfterContentChecked() {
    if (!this.validTipo) {
      const tipo = this.service.tipo;
      if (tipo) {
        this.validTipo = true;
        this.setTipo(tipo);
      }
    }
  }

  ngOnInit() {
    this.validTipo = false;
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id && id !== 0) {
        this.service.getById(id);
        this.currentId = id.toString();
      }
    });
    this.initForm();
  }

  setTipo(tipo: TipoDocumento) {
    this.tipoForm.setValue({ id: tipo.id, nombreTipoDocumento: tipo.nombreTipoDocumento });
  }

  initForm() {
    this.tipoForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      nombreTipoDocumento: new FormControl('', [Validators.minLength(2), Validators.required])
    });
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
    this.service.returnToList(true);
  }

}
