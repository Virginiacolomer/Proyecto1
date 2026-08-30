export interface Marca {
  id: number;
  denominacion: string;
  observacion: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioUpdatedId: number;
  sistema: boolean;
}

export interface DtoConsultarMarca {
  data: ConsultarMarca[];
  total: number;
}

export interface ConsultarMarca {
  id: number;
  denominacion: string;
  deletedAt?: string | null;
}

export interface SelectMarca {
  id: number;
  denominacion: string;
}
