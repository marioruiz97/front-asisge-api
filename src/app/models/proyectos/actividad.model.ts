import { EtapaPlan } from './plan-trabajo.model';
import { Usuario } from '../terceros/usuario.model';
import { EstadoActividad } from './estado-actividad.model';

export interface Actividad {
  idActividad?: number;
  nombre: string;
  responsables: Usuario[];
  etapa: EtapaPlan;
  estadoActividad: EstadoActividad;
  fechaVencimiento: Date;
  duracion: number;
  descripcion: string;
}

export interface ActividadDto {
  idActividad?: number;
  nombre: string;
  responsables: number[];
  etapa: number;
  estadoActividad: number;
  fechaVencimiento: Date;
  duracion: number;
  descripcion: string;
}

export interface Seguimiento {
  idSeguimiento?: number;
  actividadAsociada: Actividad;
  /* fechaSeguimiento?: Date; */
  createdDate?: Date;
  lastModifiedDate?: Date;
  horasTrabajadas: number;
  usuarioSeguimiento?: Usuario;
  observaciones: string;
  descripcionLabor: string;
}

export interface Tiempo {
  actividad: Actividad;
  usuario: Usuario;
  seguimientos: Seguimiento[];
  horasTrabajadas: number;
}
