import { Injectable } from '@angular/core';
import { AppService } from 'src/app/shared/app.service';
import { AppConstants as Constant} from 'src/app/shared/routing/app.constants';

@Injectable()
export class AuditsService {

  private path = Constant.PATH_AUDIT;

  constructor(private appService: AppService) { }

  fetchAll() {
    return this.appService.getRequest(this.path);
  }
}
