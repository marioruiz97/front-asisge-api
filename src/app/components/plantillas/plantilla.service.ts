import { Injectable } from '@angular/core';
import { AppService, Response } from 'src/app/shared/app.service';
import { AppConstants } from 'src/app/shared/routing/app.constants';
import { Router } from '@angular/router';
import { UiService } from 'src/app/shared/ui.service';
import { Observable } from 'rxjs';
import { Plantilla } from 'src/app/models/proyectos/plantilla.model';

@Injectable({ providedIn: 'root' })
export class PlantillaService {

  private path = AppConstants.PATH_PLANTILLAS;

  constructor(private appService: AppService, private router: Router, private uiService: UiService) { }

  fetchPlantillas() {
    return this.appService.getRequest(this.path);
  }

  fetchPlantillaById(id: number) {
    return this.appService.getRequest(`${this.path}/${id}`).toPromise();
  }

  create(data: Plantilla) {
    this.uiService.putSnackBar(this.appService.postRequest(this.path, { plantilla: data }))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }
  update(id: number, data: Plantilla) {
    this.uiService.putSnackBar(this.appService.patchRequest(`${this.path}/${id}`, { plantilla: data }))
      .subscribe(exito => { if (exito) { this.returnToList(); } });
  }

  delete(id: number) {
    return new Observable(observer => {
      const data = {
        title: 'Estás seguro de eliminar la Plantilla?',
        message: 'Esta acción es irreversible. \n¿Estás seguro?',
        confirm: 'Sí, Eliminar Plantilla'
      };
      const dialogRef = this.uiService.showConfirm(data);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.appService.deleteRequest(`${this.path}/${id}`)
            .then((res: Response) => {
              this.uiService.showSnackBar(res.message, 4);
              observer.next(true);
            })
            .catch(err => {
              const dialog = { title: 'Error', message: err.error.message, confirm: 'Ok' };
              this.uiService.showConfirm(dialog);
              observer.next(false);
            });
        }
      });
    });
  }

  showNotFound(err: any) {
    this.returnToList();
    const message = err.error ? err.error.message : 'No se han podido obtener datos';
    this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
  }


  returnToList() {
    this.router.navigate(['/plantillas']);
  }

}
