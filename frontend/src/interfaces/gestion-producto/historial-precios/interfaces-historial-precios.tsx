export interface HistorialPrecios {
  id: number;
  precioCliente: number;
  precioMayorista: number;
  precioOcasional: number;
  precioOferta: number;
  fecha: string;
  tipoDocumentoS: string;
  idDocumento: number;
  porcentajeCliente: number;
  porcentajeMayorista: number;
  porcentajeOcasional: number;
  porcentajeOferta: number;
  precioClienteConIva: number;
  precioMayoristaConIva: number;
  precioOcasionalConIva: number;
  precioOfertaConIva: number;
}

export interface DtoConsultarHistorialPrecios {
  data: ConsultarHistorialPrecios;
  total: number;
}

export interface ConsultarHistorialPrecios {
  id: number;
  fechaRealizacion: string;
  fecha: string;
  tipoDocumento: number;
  idDocumento: number;
  usuario: string;
  costo: number;
  costoNuevo: number;
  costoDolar: number;
  costoDolarNuevo: number;
  precio: number;
  precioNuevo: number;
  precioOferta: number;
  precioOfertaNuevo: number;
}
