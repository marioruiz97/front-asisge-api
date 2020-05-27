import { PlanTrabajo, EtapaPlan } from './plan-trabajo.model';
import { Actividad } from './actividad.model';

export interface PlanTrabajoBoard {
  idPlanDeTrabajo: number;
  planDeTrabajo: PlanTrabajo;
  etapas: EtapaPlanBoard[];
  aprobado: boolean;
}

export interface EtapaPlanBoard {
  etapa: EtapaPlan;
  actividades?: Actividad[];
}
