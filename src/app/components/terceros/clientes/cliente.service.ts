import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/models/terceros/cliente.model';
import { Observable } from 'rxjs';
import { AppConstants as Constant } from 'src/app/shared/routing/app.constants';
import { AppService, Response } from 'src/app/shared/app.service';
import { UiService } from 'src/app/shared/ui.service';
import { TipoDocumentoService } from '../../maestros/tipo-documento/tipo-documento.service';

@Injectable()
export class ClienteService {

  private clientePath = Constant.PATH_CLIENTE;

  constructor(private appService: AppService, private uiService: UiService, private docService: TipoDocumentoService) { }

  fetchAll(): Observable<Response> {
    return this.appService.getRequest(this.clientePath);
  }
  getById(id: number | string) {
    return this.appService.getRequest(`${this.clientePath}/${id}`).toPromise();
  }
  fetchTiposDoc(): Observable<Response> {
    return this.docService.fetchAll();
  }

  create(data: Cliente) {
    this.uiService.putSnackBar(this.appService.postRequest(this.clientePath, data));
  }
  update(id: string, data: Cliente) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.clientePath}/${id}`, data));
  }

  delete(id: string): Observable<boolean> {
    return new Observable(observer => {
      const data = {
        title: 'Estás seguro de eliminar el Cliente?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar Cliente'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.appService.deleteRequest(`${this.clientePath}/${id}`)
            .then((res: Response) => {
              this.uiService.showSnackBar(res.message, 3);
              observer.next(true);
            })
            .catch(err => {
              const dialog = { title: 'Error', message: 'No se ha podido eliminar cliente: ' + id, confirm: 'Ok' };
              this.uiService.showConfirm(dialog);
              observer.next(false);
            });
        }
      });
    });
  }

}
