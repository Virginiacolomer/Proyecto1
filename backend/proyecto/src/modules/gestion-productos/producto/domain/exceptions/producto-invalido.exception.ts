import { BadRequestException } from '@nestjs/common';

/**
 * Se lanza cuando los datos numéricos de un Producto (costo, margen, stock)
 * violan las reglas de negocio del dominio. Acumula todos los errores
 * encontrados para devolverlos en una sola respuesta.
 */
export class ProductoInvalidoException extends BadRequestException {
  constructor(errores: string[]) {
    super(errores);
  }
}
