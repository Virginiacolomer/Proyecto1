
export const CAMPOS_ULTIMA_FECHA = {
  PEDIDO: 'ultimoPedido',
  FACTURA: 'ultimoFactura',
  RECIBO: 'ultimoRecibo',
} as const;

export type CampoUltimaFecha =
  typeof CAMPOS_ULTIMA_FECHA[keyof typeof CAMPOS_ULTIMA_FECHA];