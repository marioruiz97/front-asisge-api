import { Proyecto } from './proyecto.model';

// TODO: verificar este model y si es necesario implementar dto
export interface PlanTrabajo {
  idPlanDeTrabajo?: number;
  nombrePlan: string;
  fechaInicio: Date;
  fechaFinEstimada: Date;
  fechaFinReal?: Date;
  duracion: number;
  horasMes: number;
  objetivoPlan: string;
  proyecto: Proyecto;
  etapaActual?: EtapaPlan;
  etapas?: EtapaPlan[];
}

export interface EtapaPlan {
  idEtapaPDT?: number;
  planDeTrabajo: number;
  nombreEtapa: string;
  fechaInicio: Date;
  fechaFin: Date;
}
