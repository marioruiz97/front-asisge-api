import { User } from '../terceros/user.model';
import { Cliente } from '../terceros/cliente.model';

export interface Proyecto {
  idProyecto?: number;
  nombreProyecto: string;
  descripcionGeneral: string;
  fechaCierreProyecto?: Date;
  estadoProyecto: number | EstadoProyecto;
  clienteProyecto: number | Cliente;
}

export interface EstadoProyecto {
  idEstado?: number;
  nombreEstado: string;
  descripcion?: string;
  idEstadoAnterior?: number | null;
}

export interface Miembros {
  idMiembro?: number;
  usuario: number | User;
  proyecto: number | Proyecto;
  rolProyecto: string;
}
