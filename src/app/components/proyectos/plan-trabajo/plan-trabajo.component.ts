import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AgregarMiembroComponent } from './agregar-miembro/agregar-miembro.component';
import { DIALOG_CONFIG } from 'src/app/shared/routing/app.constants';
import { AgregarEtapasComponent } from './agregar-etapas/agregar-etapas.component';

@Component({
  selector: 'app-plan-trabajo',
  templateUrl: './plan-trabajo.component.html',
  styleUrls: ['./plan-trabajo.component.css']
})
export class PlanTrabajoComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  agregarMiembro() {
    this.dialog.open(AgregarMiembroComponent, DIALOG_CONFIG);
  }

  agregarEtapa() {
    this.dialog.open(AgregarEtapasComponent, DIALOG_CONFIG);
  }

}
