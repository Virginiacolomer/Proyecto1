export interface UnidadMedida {
  id: number;
  denominacion: string;
  observacion?: string | null;
  sistema: number;
}

export interface SelectUnidadMedida {
  id: number;
  denominacion: string;
}
