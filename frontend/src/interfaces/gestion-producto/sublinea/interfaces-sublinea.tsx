export interface SubLinea {
  id: number;
  denominacion: string;
  observacion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioUpdatedId: number;
}

export interface SelectSublinea {
  id: number;
  denominacion: string;
  observacion?: string | null;
  usuarioCreatedId: number;
}
