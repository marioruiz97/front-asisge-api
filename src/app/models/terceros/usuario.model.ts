import { Role } from './role.model';
import { TipoDocumento } from './tipo-documento.model';
import { Cliente } from './cliente.model';

export interface Usuario {
  idUsuario?: number;
  identificacion: string;
  tipoDocumento: string | TipoDocumento;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  correo: string;
  contrasena: string;
  matchContrasena?: string;
  estado: boolean;
  roles: Role[];
}

export interface Asesor {
  idAsesor?: string;
  usuario: number | Usuario;
  cliente: number | Cliente;
}

export interface UserInfo {
  property: string;
  data: any;
}
