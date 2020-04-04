import { Injectable } from '@angular/core';
import { AppConstants as Constant } from '../../../shared/routing/app.constants';
import { TipoDocumento } from 'src/app/models/terceros/tipo-documento.model';
import { AppService } from 'src/app/shared/app.service';
import { UiService, ConfirmDialogData } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable()
export class TipoDocumentoService {

  private apiPath = Constant.PATH_TIPO_DOCUMENTO;

  constructor(private appService: AppService, private uiService: UiService, private router: Router) { }

  fetchAll() {
    return this.appService.getRequest(this.apiPath);
  }
  getById(id: number | string) {
    return this.appService.getRequest(`${this.apiPath}/${id}`).toPromise();
  }

  returnToList(skip: boolean = false) {
    if (skip) {
      this.router.navigate(['/tipo-documento']);
    } else {
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
  }

  create(tipo: TipoDocumento) {
    this.uiService.putSnackBar(this.appService.postRequest(this.apiPath, tipo))
      .subscribe(res => { if (res) { this.returnToList(true); } });
  }

  update(id: string, tipo: TipoDocumento) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.apiPath}/${id}`, tipo))
      .subscribe(res => { if (res) { this.returnToList(true); } });
  }

  delete(id: string) {
    return new Observable(exito => {
      const data = {
        title: 'Estás seguro de eliminar el Tipo de documento?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar Tipo'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.uiService.putSnackBar(this.appService.deleteRequest(`${this.apiPath}/${id}`))
            .subscribe(res => {
              exito.next(res);
            });
        }
      });
    });
  }

  showPopUp(dialog: ConfirmDialogData) {
    this.uiService.showConfirm(dialog);
  }

}
