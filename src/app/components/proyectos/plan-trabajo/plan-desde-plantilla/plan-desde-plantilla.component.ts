import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Plantilla } from 'src/app/models/proyectos/plantilla.model';
import { DashboardService } from '../../dashboard/dashboard.service';
import { PlanTrabajoService } from '../plan-trabajo.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
import { PlantillaService } from 'src/app/components/plantillas/plantilla.service';

@Component({
  selector: 'app-plan-plantilla',
  templateUrl: './plan-desde-plantilla.component.html',
  styleUrls: ['./plan-desde-plantilla.component.css']
})
export class PlanDesdePlantillaComponent implements OnInit, OnDestroy {

  planPlantillaForm: FormGroup;
  selectPlantillaForm: FormGroup;

  plantillas: Plantilla[] = [];
  selectedPlantilla: Plantilla;
  isWaiting = false;
  minDate = new Date();
  maxDate: Date = null;

  private idProyecto: number;
  private subs: Subscription[] = [];

  constructor(
    private uiService: UiService, private service: PlanTrabajoService,
    private dashboardService: DashboardService, private plantillaService: PlantillaService
  ) { }

  ngOnInit() {
    this.initForms();
    this.subs.push(this.uiService.loadingState.subscribe(state => this.isWaiting = state));
    this.subs.push(this.plantillaService.fetchPlantillas().subscribe(res => this.plantillas = res.body as Plantilla[]));
    this.subs.push(this.dashboardService.proyecto.subscribe(proyecto => {
      this.minDate = proyecto.createdDate ? proyecto.createdDate : this.minDate;
      this.maxDate = proyecto.fechaCierreProyecto ? proyecto.fechaCierreProyecto : null;
      this.idProyecto = proyecto.idProyecto;
    }));
    this.dashboardService.fetchInfoProyecto();
  }

  private initForms() {
    this.planPlantillaForm = new FormGroup({
      nombrePlan: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      fechaInicio: new FormControl('', Validators.required),
      fechaFinEstimada: new FormControl('', Validators.required),
      horasMes: new FormControl(0, [Validators.required, Validators.min(1)]),
      objetivoPlan: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
    this.selectPlantillaForm = new FormGroup({
      plantilla: new FormControl('', Validators.required)
    });
  }


  onSubmit() {
    this.service.crearPlanDesdeTemplate(this.planPlantillaForm.value, this.idProyecto, this.selectedPlantilla.idPlantilla);
  }

  selectPlantilla() {
    this.selectedPlantilla = this.plantillas.filter(plantilla =>
      plantilla.idPlantilla === this.selectPlantillaForm.value.plantilla).slice()[0];
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + this.selectedPlantilla.duracion);
    this.planPlantillaForm.setValue({
      nombrePlan: '',
      fechaInicio: new Date(),
      fechaFinEstimada: fechaFin,
      horasMes: this.selectedPlantilla.horasMes,
      objetivoPlan: '',
    });
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
