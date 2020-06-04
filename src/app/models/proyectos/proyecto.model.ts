import { Usuario } from '../terceros/usuario.model';
import { Cliente } from '../terceros/cliente.model';

export interface Proyecto {
  idProyecto?: number;
  nombreProyecto: string;
  descripcionGeneral: string;
  fechaCierreProyecto?: Date;
  estadoProyecto: EstadoProyecto;
  cliente: Cliente;
  lastModifiedDate?: Date;
  createdDate?: Date;
  contrato?: string;
  anticipo?: string;
}

export interface ProyectoDto {
  idProyecto?: number;
  nombreProyecto: string;
  descripcionGeneral: string;
  fechaCierreProyecto?: Date;
  estadoProyecto: number;
  cliente: number;
}

export interface EstadoProyecto {
  id?: number;
  nombreEstado: string;
  descripcion?: string;
  idEstadoAnterior?: number | null;
  requerido: boolean;
}

export interface EstadoLineDto {
  estado: EstadoProyecto;
  actual: boolean;
  completado: boolean;
}

export interface Miembros {
  idMiembroProyecto?: number;
  usuario: Usuario;
  proyecto: Proyecto;
  rolProyecto: string;
}

export interface MiembroDto {
  idMiembroProyecto?: number;
  usuario: number;
  proyecto: number;
  rolProyecto: string;
}
