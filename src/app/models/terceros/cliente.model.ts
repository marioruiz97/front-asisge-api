import { TipoDocumento } from './tipo-documento.model';

export interface Cliente {
  idCliente?: number;
  identificacion: string;
  nombreComercial: string;
  razonSocial: string;
  tipoDocumento: number | TipoDocumento;
  contactos?: Contacto[];
}

export interface Contacto {

  idContacto?: number;
  nombre: string;
  telefono?: string;
  correo: string;
}
