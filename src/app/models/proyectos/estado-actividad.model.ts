
export interface EstadoActividad {
  idEstado?: number;
  nombreEstado: string;
  descripcion?: string;
  estadoInicial: boolean;
  actividadNoAprobada: boolean;
  actividadCompletada: boolean;
}
