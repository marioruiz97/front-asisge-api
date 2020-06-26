import { Proyecto } from './proyecto.model';


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
  cierre?: Cierre;
}

export interface EtapaPlan {
  idEtapaPDT?: number;
  planDeTrabajo: number;
  nombreEtapa: string;
  fechaInicio: Date;
  fechaFin: Date;
  cierre?: Cierre;
}

export interface AprobacionPlan {
  id?: number;
  createdDate?: Date;
  plan: PlanTrabajo;
  avalCliente: boolean;
  observaciones: string;
  rutaArchivo: string;
}

export interface Cierre {
  idCierre?: number;
  avalCliente: boolean;
  observaciones: string;
  createdDate?: Date;
}
