import { TipoDocumento } from './tipo-documento.model';

export interface Cliente {
  idCliente?: number;
  identificacion: string;
  nombreComercial: string;
  razonSocial: string;
  tipoDocumento: TipoDocumento;
  contactos?: Contacto[];
}

export interface ClienteDto {
  idCliente?: number;
  identificacion: string;
  nombreComercial: string;
  razonSocial: string;
  tipoDocumento: number;
  contactos?: Contacto[];
}

export interface Contacto {
  id?: number;
  idCliente?: number;
  nombre: string;
  telefono?: string;
  correo: string;
}
