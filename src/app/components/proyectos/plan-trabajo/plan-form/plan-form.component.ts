import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UiService } from 'src/app/shared/ui.service';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit, OnDestroy {

  planForm: FormGroup;
  isWaiting = false;
  minDate = new Date();

  private idProyecto: number;
  private subs: Subscription[] = [];

  constructor(
    private uiService: UiService, private service: PlanTrabajoService, private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.initForm();
    this.subs.push(this.dashboardService.proyecto.subscribe(proyecto => {
      if (!proyecto) {
        const message = 'No se encontró proyecto, asegúrate que ingresas desde el dashboard';
        this.uiService.showConfirm({ title: 'Error', message, confirm: 'Ok' });
        this.dashboardService.returnToList();
        return;
      }
      this.idProyecto = proyecto.idProyecto;
    }));
    this.dashboardService.fetchInfoProyecto();
  }

  initForm() {
    this.planForm = new FormGroup({
      nombrePlan: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      fechaInicio: new FormControl('', Validators.required),
      fechaFinEstimada: new FormControl('', Validators.required),
      horasMes: new FormControl(0, [Validators.required, Validators.min(1)]),
      objetivoPlan: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  onSubmit() {
    this.service.crearPlan(this.planForm.value, this.idProyecto);
  }

  goBack() {
    const data = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar'
    };
    const dialogRef = this.uiService.showConfirm(data);
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) { this.service.returnToDashboard(); }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
