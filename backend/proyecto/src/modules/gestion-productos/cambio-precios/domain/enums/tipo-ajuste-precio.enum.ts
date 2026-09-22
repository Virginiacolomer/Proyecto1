/**
 * Forma en que se calcula un aumento (o descuento) masivo de precios.
 * Ver Decisión de diseño #1 de la HU CR-006 (Actualización masiva de precios).
 */
export enum TipoAjustePrecio {
  PORCENTAJE = 'PORCENTAJE',
  MONTO_FIJO = 'MONTO_FIJO',
}
