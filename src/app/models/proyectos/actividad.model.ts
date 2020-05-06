import { EtapaPlan } from './plan-trabajo.model';
import { Usuario } from '../terceros/usuario.model';

export interface Actividad {
  idActividad?: number;
  nombre: string;
  responsables: Usuario[];
  etapa: EtapaPlan;
  fechaVencimiento: Date;
  duracion: number;
  descripcion: string;
}

export interface ActividadDto {
  idActividad?: number;
  nombre: string;
  responsables: number[];
  etapa: number;
  fechaVencimiento: Date;
  duracion: number;
  descripcion: string;
}

export interface Seguimiento {
  idSeguimiento?: number;
  actividadAsociada: Actividad;
  fechaSeguimiento?: Date;
  horasTrabajadas: number;
  usuarioSeguimiento?: Usuario;
  observaciones: string;
  descripcionLabor: string;
}
