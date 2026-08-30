export type Rol = {
  id: number;
  denominacion: string;
};

export interface Usuario {
  id: number;
  mail: string;
  rol: string;
  denominacion: string;
  roles: Rol[];
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface SelectUsuario {
  id: number;
  denominacion: string;
}
export interface DtoConsultarUsuario {
  data: ConsultarUsuario[];
  total: number;
}

export interface ConsultarUsuario {
  id: number;
  denominacion: string;
}


