import { Injectable } from '@angular/core';
import { AppService, Response } from 'src/app/shared/app.service';
import { TipoDocumentoService } from '../../maestros/tipo-documento/tipo-documento.service';
import { UiService, ConfirmDialogData } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { AppConstants as Constant } from 'src/app/shared/routing/app.constants';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/terceros/usuario.model';

@Injectable()
export class UsuarioService {

  private userPath = Constant.PATH_USUARIO;
  private asesorPath = Constant.PATH_ASESOR;

  constructor(
    private appService: AppService, private docService: TipoDocumentoService, private uiService: UiService,
    private router: Router
  ) { }

  fetchAll(): Observable<Response> {
    return this.appService.getRequest(this.userPath);
  }

  fetchDocumentos() {
    return this.docService.fetchAll();
  }

  fetchClientes(idUsuario: string | number) {
    return this.appService.getRequest(this.asesorPath + `?usuario=${idUsuario}`);
  }

  fetchById(id: string | number) {
    return this.appService.getRequest(`${this.userPath}/${id}`).toPromise();
  }

  saveClientes(idUsuario, list: any[]) {
    return this.uiService.putSnackBar(this.appService.patchRequest(`${this.asesorPath}/${idUsuario}`, list));
  }

  create(data: Usuario) {
    this.uiService.putSnackBar(this.appService.postRequest(this.userPath, data))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }
  update(id: string | number, data: Usuario) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.userPath}/${id}`, data))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }

  delete(id: string): Observable<boolean> {
    return new Observable(observer => {
      const data = {
        title: 'Estás seguro de eliminar el Usuario?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar Usuario'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.appService.deleteRequest(`${this.userPath}/${id}`)
            .then((res: Response) => {
              this.uiService.showSnackBar(res.message, 4);
              observer.next(true);
            })
            .catch(_ => {
              const dialog = { title: 'Error', message: 'No se ha podido eliminar usuario: ' + id, confirm: 'Ok' };
              this.uiService.showConfirm(dialog);
              observer.next(false);
            });
        }
      });
    });
  }


  returnToList() {
    this.router.navigate(['/usuarios']);
  }

}
