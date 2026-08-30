export interface Personal {
  id: number;
  denominacion: string;
  observacion?: string | null;
  mail?: string;
  esVendedor?: boolean;
}

export interface SelectPersonal {
  id: number;
  denominacion: string;
}

export interface IConsultarPersonal {
  id: number;
  denominacion: string;
  observacion?: string | null;
}
