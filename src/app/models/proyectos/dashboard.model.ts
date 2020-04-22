import { Cliente } from '../terceros/cliente.model';
import { Miembros, Proyecto, EstadoProyecto } from './proyecto.model';

export interface Dashboard {
  idDashboard: number;
  cliente: Cliente;
  miembros: Miembros[];
  proyecto: Proyecto;
  estadoActual: EstadoProyecto;
}
