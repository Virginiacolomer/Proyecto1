import { Domicilio, SelectVendedor } from "../../generales/interfaces-generales";
import { SelectCondicionIva } from "../condicion-iva/interfaces-condicion-iva";

export interface Cliente {
  id: number;
  codigo?: string;
  denominacion: string;
  denominacionAfip: string | null;
  cuit?: string | null;
  dni?: string | null;
  domicilio: Domicilio;
  observacion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioUpdatedId: number;
  sistema: number;
  saldo: number;
  mail?: string | null;
  contactoNombre?: string | null;
  contactoCargo?: string | null;
  celular?: string | null;
  condicionIva: SelectCondicionIva;
  vendedor: SelectVendedor;
}

export interface DtoSelectCliente {
  data: SelectCliente[];
  total: number;
}

export interface SelectCliente {
  id: number;
  codigo: string;
  denominacion: string;
  condicionIva: string;
  cuit: string;
  dni: string;
  domicilio: string;
  domicilioString: string;
  letra: string;
  saldo: number;
  vendedor: SelectVendedor;
}

export interface DtoConsultarCliente {
  data: ConsultarCliente[];
  total: number;
}

export interface ConsultarCliente {
  id: number;
  codigo: string;
  denominacion: string;
  codigoProveedor: string;
  letra: string;
  cuit: string;
  condicionIva: string;
  domicilio: string;
  saldo: number;
}

export interface SelectZona {
  id: number;
  denominacion: string;
}

