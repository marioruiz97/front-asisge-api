import { Injectable } from '@angular/core';
import { AppConstants as Constant } from '../../../shared/routing/app.constants';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { AppService } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';


@Injectable()
export class TipoDocumentoService {

  private $tipo: TipoDocumento;

  constructor(private appService: AppService, private uiService: UiService, private router: Router) { }

  fetchAll() {
    return this.appService.getRequest(Constant.PATH_TIPO_DOCUMENTO);
  }

  getById(id: number | string) {
    this.appService.getRequest(`${Constant.PATH_TIPO_DOCUMENTO}/${id}`).toPromise()
      .then(res => this.$tipo = res.body)
      .catch(err => this.uiService.showSnackBar(err.message, 3));
  }

  get tipo(): TipoDocumento {
    return this.$tipo;
  }

  returnToList() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/tipo-documento']);
      }
    });
  }

  create(tipo: TipoDocumento) {
    this.uiService.putSnackBar(this.appService.postRequest(Constant.PATH_TIPO_DOCUMENTO, tipo));
    this.router.navigate(['/tipo-documento']);
  }

  update(id: string, tipo: TipoDocumento) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${Constant.PATH_TIPO_DOCUMENTO}/${id}`, tipo));
    this.router.navigate(['/tipo-documento']);
  }

  delete(id: string) {
    const data = {
      title: 'Estás seguro de eliminar el Tipo de documento?',
      message: 'Esta acción es irreversible. \n¿Estás seguro?',
      confirm: 'Sí, Eliminar Tipo'
    };
    const dialogRef = this.uiService.showConfirm(data);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uiService.putSnackBar(this.appService.deleteRequest(`${Constant.PATH_TIPO_DOCUMENTO}/${id}`));
      }
    });
  }

}
