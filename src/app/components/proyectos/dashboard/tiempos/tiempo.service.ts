import { Injectable } from '@angular/core';
import { AppService } from 'src/app/shared/app.service';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';

@Injectable()
export class TiempoService {

  constructor(private appService: AppService) {
  }

  fetchTiempos(idPlan: number) {
    const path = Cons.PATH_TIEMPOS.replace('{idPlan}', idPlan.toString());
    return this.appService.getRequest(path);
  }


}
