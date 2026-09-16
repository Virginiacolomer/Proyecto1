import { SelectSuperlinea } from "../superlinea/interfaces-superlinea";

export interface Linea {
  id: number;
  denominacion: string;
  observacion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioUpdatedId: number;
  superLineaId: number;
  superlinea?: SelectSuperlinea;
  sistema: number;
  stockMinimo: number | null;
  utilizaStockMinimo: boolean | null;
}

export interface DtoConsultarLinea {
  data: ConsultarLinea[];
  total: number;
}

export interface ConsultarLinea {
  id: number;
  denominacion: string;
  superlinea?: SelectSuperlinea;
}

export interface SelectLinea {
  id: number;
  denominacion: string;
}
