import { Domicilio, SelectVendedor } from "../../generales/interfaces-generales";
import { SelectCondicionIva } from "../condicion-iva/interfaces-condicion-iva";

export interface Proveedor {
  id: number;
  codigo?: string | null;
  denominacion: string;
  denominacionAfip: string | null;
  cuit?: string | null;
  condicionIva: SelectCondicionIva;
  condicionIvaId: number;
  domicilio: Domicilio;
  observacion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioUpdatedId: number;
  sistema: number;
  saldo: number;
  esProveedorGastos?: boolean;
  esProveedorMateriaPrima?: boolean;
}

export interface DtoConsultarProveedor {
  data: ConsultarProveedor[];
  total: number;
}

export interface DtoSelectProveedor {
  data: SelectProveedor[];
  total: number;
}

export interface SelectProveedor {
  id: number;
  codigo?: string | null;
  denominacion: string;
  condicionIva: string;
  cuit: string;
  dni: string;
  domicilio: string;
  domicilioString: string;
  letra: string;
  saldo: number;
  vendedor: SelectVendedor;
  esProveedorGastos?: boolean;
  esProveedorMateriaPrima?: boolean;
}

export interface ConsultarProveedor {
  id: number;
  codigo?: string | null;
  denominacion: string;
  letra: string;
  cuit: string;
  condicionIva: string;
  domicilio: string;
  saldo: number;
}
