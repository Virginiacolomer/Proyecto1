export interface Localidad {
  id: number;
  denominacion: string;
  provincia: SelectProvincia;
  codigoPostal: string | null;
  observacion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  sistema: number;
}

export interface Provincia {
  id: number;
  denominacion: string;
  observacion: string | null;
  usuarioCreatedId: number;
}

export interface DtoSelectLocalidad {
  data: SelectLocalidad[];
  total: number;
}

export interface SelectLocalidad {
  id: number;
  denominacion: string;
  codigoPostal: string;
}

export interface DtoSelectProvincia {
  data: SelectProvincia[];
  total: number;
}

export interface SelectProvincia {
  id: number;
  denominacion: string;
}
