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
  nombreEtapa: string;
  duracion: number;
  actividades?: PlantillaActividad[];
}

export interface PlantillaActividad {
  nombre: string;
  duracion: number;
}
