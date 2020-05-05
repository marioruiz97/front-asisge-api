import { Subject } from 'rxjs';

export interface Plantilla {
  idPlantilla?: number;
  nombrePlantilla: string;
  descripcionPlantilla: string;
  duracion: number;
  horasMes: number;
  etapas?: PlantillaEtapa[];
  createdBy: string;
  createdDate: Date;
  lastModifiedDate: Date;
}

export interface PlantillaEtapa {
  idPlantillaEtapa?: number;
  nombreEtapa: string;
  duracion: number;
  actividades?: PlantillaActividad[];
  observable?: Subject<PlantillaActividad[]>;
}

export interface PlantillaActividad {
  idActividad?: number;
  nombre: string;
  duracion: number;
}
