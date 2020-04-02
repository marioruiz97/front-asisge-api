import { Injectable } from '@angular/core';
import { AppConstants as Constant } from '../../../shared/routing/app.constants';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { AppService } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Injectable()
export class TipoDocumentoService {

  listTipos: TipoDocumento[];
  private listSub: Subscription;

  constructor(private appService: AppService, private uiService: UiService) { }

  getAll(): TipoDocumento[] {
    this.listTipos = [];
    this.listSub = this.appService.getRequest(Constant.PATH_TIPO_DOCUMENTO).subscribe(
      result => this.listTipos = result.body, err => console.log(err)
    );
    return this.listTipos;
  }

  getById(id: number): TipoDocumento {
    let tipo: TipoDocumento;
    this.appService.getRequest(`${Constant.PATH_TIPO_DOCUMENTO}/${id}`).toPromise()
      .then(res => tipo = res.body)
      .catch(err => this.uiService.showSnackBar(err.message, 3));
    return tipo;
  }

  create(tipo: TipoDocumento) {
    this.uiService.putSnackBar(this.appService.postRequest(Constant.PATH_TIPO_DOCUMENTO, tipo));
  }

  update(id: number, tipo: TipoDocumento) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${Constant.PATH_TIPO_DOCUMENTO}/${id}`, tipo));
  }

  delete(id: number) {
    this.uiService.putSnackBar(this.appService.deleteRequest(`${Constant.PATH_TIPO_DOCUMENTO}/${id}`));
  }

  cancelSubscription() {
    if (this.listSub) { this.listSub.unsubscribe(); }
  }

}
