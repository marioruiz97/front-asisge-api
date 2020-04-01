import { Proyecto } from './proyecto.model';

export interface PlanTrabajo {
  idPlan?: number;
  fechaInicio: Date;
  fechaFinEstimada: Date;
  fechaFinReal: Date;
  duracion: number;
  horasMes: number;
  objetivoPlan: string;
  proyecto: number | Proyecto;
  etapaActual?: number | EtapaPlan;
  etapas?: EtapaPlan[];
}


export interface EtapaPlan {
  idEtapa?: number;
  planDeTrabajo: number;
  nombreEtapa: string;
  fechaInicio: Date;
  fechaFin: Date;
}
