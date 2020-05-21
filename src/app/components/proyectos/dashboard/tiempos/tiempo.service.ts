import { Injectable } from '@angular/core';
import { AppService } from 'src/app/shared/app.service';
import { AppConstants as Cons } from 'src/app/shared/routing/app.constants';
import { Tiempo } from 'src/app/models/proyectos/actividad.model';
import { Subject } from 'rxjs';

@Injectable()
export class TiempoService {

  private planId: number;
  private tiemposList: Tiempo[] = [];
  tiempos = new Subject<Tiempo[]>();

  constructor(private appService: AppService) {
  }

  fetchTiempos(idPlan: number, skipIf = false) {
    if (!skipIf && this.planId === idPlan) {
      this.tiempos.next(this.tiemposList);
    } else {
      const path = Cons.PATH_TIEMPOS.replace('{idPlan}', idPlan.toString());
      this.planId = idPlan;
      this.appService.getRequest(path).subscribe(res => {
        this.tiemposList = res.body;
        this.tiempos.next(this.tiemposList);
      });
    }
  }


}
