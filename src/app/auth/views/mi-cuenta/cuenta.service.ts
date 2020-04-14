import { Injectable } from '@angular/core';
import { AppService, Response } from 'src/app/shared/app.service';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { Observable } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';

export interface Cuenta {
  idUsuario: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  correo: string;
}

@Injectable()
export class CuentaService {

  constructor(
    private appService: AppService, private uiService: UiService
  ) { }

  get myInfo(): Observable<Response> {
    return this.appService.getRequest(Cons.PATH_AUTH + '/me');
  }

  saveMyInfo(usuario: Cuenta) {
    const path = Cons.PATH_AUTH + '/me';
    return this.uiService.putSnackBar(this.appService.postRequest(path, usuario)).toPromise();
  }

  changePassword(data: any, idUsuario: number) {
    const path = Cons.PATH_AUTH + '/cambio-contrasena/' + idUsuario;
    return this.uiService.putSnackBar(this.appService.postRequest(path, data));
  }

  fetchMisClientes(idUsuario: number) {
    const path = Cons.PATH_ASESOR + '?usuario=' + idUsuario;
    return this.appService.getRequest(path);
  }

  fetchMisProyectos(idUsuario: number) {
    const path = Cons.PATH_MIS_PROYECTOS.replace('{id}', idUsuario.toString());
    return this.appService.getRequest(path);
  }

  quitarCliente(idCliente: number, idUsuario: number) {
    const path = Cons.PATH_ASESOR + `?usuario=${idUsuario}&cliente=${idCliente}`;
    return this.uiService.putSnackBar(this.appService.deleteRequest(path));
  }
}
