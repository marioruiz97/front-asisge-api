import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Proyecto } from 'src/app/models/proyectos/proyecto.model';
import { UiService } from 'src/app/shared/ui.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Response } from 'src/app/shared/app.service';

@Component({
  selector: 'app-archivos-proyecto',
  templateUrl: './archivos-proyecto.component.html',
  styleUrls: ['./archivos-proyecto.component.css']
})
export class ArchivosProyectoComponent implements OnInit, OnDestroy {

  isWaiting = false;
  contrato: File;
  anticipo: File;

  private subs: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Proyecto,
    private dialogRef: MatDialogRef<ArchivosProyectoComponent>,
    private uiService: UiService,
    private service: DashboardService
  ) { }

  ngOnInit() {
  }

  quitarArchivo(ref, action: number) {
    ref.value = '';
    switch (action) {
      case 0:
        this.contrato = null;
        break;
      case 1:
        this.anticipo = null;
        break;
      default:
        break;
    }
  }

  seleccionarContrato(event) {
    if (event.target.files.length !== 0) {
      this.contrato = event.target.files[0];
    }
  }

  seleccionarAnticipo(event) {
    if (event.target.files.length !== 0) {
      this.anticipo = event.target.files[0];
    }
  }

  cargarContrato() {
    if (this.contrato && this.contrato.name.includes('contrato')) {
      this.isWaiting = true;
      this.service.cargarContrato(this.contrato, this.data.idProyecto).subscribe((res: Response) => {
        this.isWaiting = false;
        this.uiService.showSnackBar(res.message, 3);
        this.service.dashboard.proyecto = res.body;
        this.data.contrato = res.body.contrato;
        this.service.fetchInfoProyecto();
      });
    } else {
      return this.uiService.showSnackBar('Debes seleccionar un archivo primero y asegúrate que el nombre contenga la palabre contrato', 3);
    }
  }

  cargarAnticipo() {
    if (this.anticipo && this.anticipo.name.includes('anticipo')) {
      this.isWaiting = true;
      this.service.cargarAnticipo(this.anticipo, this.data.idProyecto).subscribe((res: Response) => {
        this.isWaiting = false;
        this.uiService.showSnackBar(res.message, 3);
        this.service.dashboard.proyecto = res.body;
        this.data.anticipo = res.body.anticipo;
        this.service.fetchInfoProyecto();
      });
    } else {
      return this.uiService.showSnackBar('Debes seleccionar un archivo primero y asegúrate que el nombre contenga la palabra anticipo', 3);
    }
  }


  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
