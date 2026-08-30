export enum Area {
  FACTURA   = 1,
  STOCK     = 2,
  COMPRA   = 3,
  GASTOS = 4,
  PAGOS    = 5,
}
export enum EntidadTipo {
  PRODUCTO  = 0,
  PEDIDO    = 1,
  CLIENTE   = 2,
  FACTURA   = 3,
  PROVEEDOR = 4,
}
export interface ProductoNotificacion {
  id: number;
  denominacion: string;
  stock: number;
}

export interface MotivoNotificacionUsuarioDto {
  id: number;
  denominacion: string;
}

export interface UsuarioDto {
  id: number;
  denominacion: string;
}

export interface ListadoConTotalDto<T> {
  data: T[];
  total: number;
}

export interface CreateNotificacionUsuarioPayload {
  destinatarioId: number;
  motivoId: number;
  comentario: string;
  empresaId: number;
  puntoVentaId: number;
  usuarioCreatedId: number;
  fechaDocumento: string;
  remitenteId: number;
  entidadTipo: EntidadTipo;
  entidadId: number;
}

export interface NotificacionModalProps {
  open: boolean;
  producto: ProductoNotificacion | null;
  entidadTipo: EntidadTipo;
  onClose: () => void;
}
