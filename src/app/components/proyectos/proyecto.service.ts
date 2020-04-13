import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService, Response } from 'src/app/shared/app.service';
import { AppConstants } from 'src/app/shared/routing/app.constants';

@Injectable()
export class ProyectoService {

  private proyectoPath = AppConstants.PATH_PROYECTOS;

  constructor(private appService: AppService) { }

  fetchProyectos(): Observable<Response> {
    return this.appService.getRequest(this.proyectoPath);
  }

}
