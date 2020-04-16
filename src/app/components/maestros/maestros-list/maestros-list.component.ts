import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { AppService } from 'src/app/shared/app.service';
import { AppConstants as Constant } from 'src/app/shared/routing/app.constants';

@Component({
  selector: 'app-maestros-list',
  templateUrl: './maestros-list.component.html',
  styleUrls: ['./maestros-list.component.css']
})
export class MaestrosListComponent implements OnInit, OnDestroy {

  private tokenPath = Constant.PATH_DELETE_TOKENS;
  private subs: Subscription[] = [];

  constructor(
    private uiService: UiService,
    private appService: AppService
  ) { }

  ngOnInit() {
  }

  eliminarTokens() {
    const data = {
      title: 'Estás seguro de eliminar los tokens?',
      message: 'Esta acción es irreversible. \n¿Estás seguro?',
      confirm: 'Sí, Eliminar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uiService.putSnackBar(this.appService.deleteRequest(this.tokenPath));
      }
    })
    );
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(s => s.unsubscribe()); }
  }
}
