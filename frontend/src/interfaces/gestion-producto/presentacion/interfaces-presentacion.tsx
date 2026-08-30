export interface Presentacion {
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


export interface ConsultarPresentacion {
  id: number;
  denominacion: string;
}

export interface SelectPresentacion {
  id: number;
  denominacion: string;
}

export interface SelectEnvase {
  id: number;
  denominacion: string;
}

export interface SelectUnidad {
  id: number;
  denominacion: string;
}