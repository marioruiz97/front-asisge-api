import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService, Response } from 'src/app/shared/app.service';
import { AppConstants } from 'src/app/shared/routing/app.constants';
import { UiService } from 'src/app/shared/ui.service';

@Injectable()
export class ProyectoService {

  private proyectoPath = AppConstants.PATH_PROYECTOS;

  constructor(private appService: AppService, private uiService: UiService) { }

  fetchProyectos(): Observable<Response> {
    return this.appService.getRequest(this.proyectoPath);
  }




  showNotFound(err) {
    const message = err.error ? err.error.message : 'Ha ocurrido un error';
    this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
  }

}
