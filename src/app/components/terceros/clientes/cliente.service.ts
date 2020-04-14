import { Injectable } from '@angular/core';
import { Cliente, Contacto, ClienteDto } from 'src/app/models/terceros/cliente.model';
import { Observable, Subject } from 'rxjs';
import { AppConstants as Constant } from 'src/app/shared/routing/app.constants';
import { AppService, Response } from 'src/app/shared/app.service';
import { UiService, ConfirmDialogData } from 'src/app/shared/ui.service';
import { TipoDocumentoService } from '../../maestros/tipo-documento/tipo-documento.service';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

  private clientePath = Constant.PATH_CLIENTE;
  private asesorPath = Constant.PATH_ASESOR;
  private clienteAsesorAth = Constant.PATH_CLIENTE_ASESOR;

  contactosChanged = new Subject<Contacto[]>();

  constructor(
    private appService: AppService, private uiService: UiService,
    private docService: TipoDocumentoService, private router: Router
  ) { }

  fetchAll(): Observable<Response> {
    return this.appService.getRequest(this.clientePath);
  }
  getById(id: number | string) {
    return this.appService.getRequest(`${this.clientePath}/${id}`).toPromise();
  }

  fetchTiposDoc(): Observable<Response> {
    return this.docService.fetchAll();
  }

  fetchUsuarios(idCliente: number) {
    return this.appService.getRequest(this.asesorPath + `?cliente=${idCliente}`);
  }

  saveUsuarios(idCliente: number, list: any[]) {
    return this.uiService.putSnackBar(this.appService.patchRequest(`${this.clienteAsesorAth}/${idCliente}`, list));
  }

  create(data: ClienteDto) {
    this.uiService.putSnackBar(this.appService.postRequest(this.clientePath, data))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }
  update(id: number, data: ClienteDto) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.clientePath}/${id}`, data))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }

  updateContacto(contacto: Contacto) {
    return this.appService.patchRequest(`${Constant.PATH_CONTACTO}/${contacto.id}`, contacto);
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
              this.uiService.showSnackBar(res.message, 4);
              observer.next(true);
            })
            .catch(_ => {
              const dialog = { title: 'Error', message: 'No se ha podido eliminar cliente: ' + id, confirm: 'Ok' };
              this.showError(dialog);
              observer.next(false);
            });
        }
      });
    });
  }


  /**
   * MÉTODOS DE UI
   */
  returnToList() {
    this.router.navigate(['/clientes']);
  }

  showError(dialog: ConfirmDialogData) {
    return this.uiService.showConfirm(dialog);
  }

  showNotFound(err) {
    this.returnToList();
    const message = err.error ? err.error.message : 'No se han podido obtener datos';
    this.showError({ title: 'Error', message, confirm: 'Ok' });
  }

}
