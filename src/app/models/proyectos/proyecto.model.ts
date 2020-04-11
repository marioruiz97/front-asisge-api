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
}

export interface Miembros {
  idMiembro?: number;
  usuario: number | Usuario;
  proyecto: number | Proyecto;
  rolProyecto: string;
}
