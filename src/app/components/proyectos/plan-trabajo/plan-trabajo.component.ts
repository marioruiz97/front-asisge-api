import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AgregarMiembroComponent } from './agregar-miembro/agregar-miembro.component';
import { DIALOG_CONFIG } from 'src/app/shared/routing/app.constants';
import { AgregarEtapasComponent } from './agregar-etapas/agregar-etapas.component';
import { PlanTrabajoService } from './plan-trabajo.service';
import { Subscription } from 'rxjs';
import { PlanTrabajo } from 'src/app/models/proyectos/plan-trabajo.model';
import { ModalActividadComponent } from './modal-actividad/modal-actividad.component';

@Component({
  selector: 'app-plan-trabajo',
  templateUrl: './plan-trabajo.component.html',
  styleUrls: ['./plan-trabajo.component.css']
})
export class PlanTrabajoComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  planActual: PlanTrabajo;

  constructor(private dialog: MatDialog, private service: PlanTrabajoService) { }

  ngOnInit() {
    this.subs.push(this.service.planActualSubject.subscribe(plan => this.planActual = plan.planDeTrabajo));
    this.service.fetchPlanActual();
  }

  recargarPlan() {
    if (this.planActual) {
      this.service.recargarPlan(this.planActual.idPlanDeTrabajo);
    }
  }

  agregarMiembro() {
    this.dialog.open(AgregarMiembroComponent, DIALOG_CONFIG);
  }

  agregarEtapa() {
    if (this.verificarPlan()) {
      this.dialog.open(AgregarEtapasComponent, DIALOG_CONFIG);
    }
  }

  agregarActividad() {
    if (this.verificarPlan()) {
      this.dialog.open(ModalActividadComponent, { ...DIALOG_CONFIG, data: {} });
    }
  }

  verificarPlan() {
    if (!this.service.planActual) {
      this.service.showSeleccionarEtapaAlert();
      return false;
    }
    return true;
  }


  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
