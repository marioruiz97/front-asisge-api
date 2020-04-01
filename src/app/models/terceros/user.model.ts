import { ProfileData } from './profile.model';
import { TipoDocumento } from './tipo-documento.model';
import { Cliente } from './cliente.model';

export interface User {
  idUsuario?: string;
  identificacion: string;
  tipoDocumento: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  email: string;
  password: string;
  perfil: string;
}

export interface Asesor {
  idAsesor?: number;
  usuario: number | User;
  cliente: number | Cliente;
}
