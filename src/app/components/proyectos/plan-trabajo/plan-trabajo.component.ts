import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AgregarMiembroComponent } from './agregar-miembro/agregar-miembro.component';

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
    const config: MatDialogConfig = {
      disableClose: true,
      position: { right: '0px' },
      maxWidth: '100vw',
      minWidth: '50vw',
    };
    this.dialog.open(AgregarMiembroComponent, config);
  }

}
