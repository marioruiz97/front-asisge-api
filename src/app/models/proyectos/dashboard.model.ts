import { Cliente } from '../terceros/cliente.model';
import { Miembros, Proyecto, EstadoProyecto, EstadoLineDto } from './proyecto.model';
import { Usuario } from '../terceros/usuario.model';

export interface Dashboard {
  idDashboard: number;
  cliente: Cliente;
  miembros: Miembros[];
  proyecto: Proyecto;
  estadoActual: EstadoProyecto;
  notificaciones: Notificacion[];
  lineaEstados: EstadoLineDto[];
}

export interface Notificacion {
  id: number;
  proyecto: Proyecto;
  color: string;
  mensaje: string;
  fechaCreacion: Date;
  diasValido: number;
}

export interface NotificacionUsuario {
  idNotificacionUsuario: number;
  notificacion: Notificacion;
  usuario: Usuario;
  visto: boolean;
}
