export interface Superlinea {
  id: number;
  denominacion: string;
  observacion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioDeletedId: number;
  usuarioUpdatedId: number;
  sistema: number;
}

export interface SelectSuperlinea {
  id: number;
  denominacion: string;
}
