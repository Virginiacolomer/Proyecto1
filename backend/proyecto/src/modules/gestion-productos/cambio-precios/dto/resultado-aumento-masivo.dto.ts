/** Fila de previsualización devuelta por POST /cambio-precios/simular */
export interface ProductoAumentoPreviewDto {
  productoId: number;
  denominacion: string;
  precioActual: number;
  precioNuevo: number;
}

/** Producto que no pudo actualizarse al aplicar el aumento (Decisión #5) */
export interface ProductoAumentoFallidoDto {
  productoId: number;
  denominacion: string;
  motivo: string;
}

/** Resultado devuelto por POST /cambio-precios/aplicar */
export interface ResultadoAumentoMasivoDto {
  loteId: string;
  actualizados: ProductoAumentoPreviewDto[];
  fallidos: ProductoAumentoFallidoDto[];
}
