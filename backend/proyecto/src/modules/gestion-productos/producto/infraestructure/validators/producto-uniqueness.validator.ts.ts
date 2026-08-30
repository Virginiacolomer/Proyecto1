// infrastructure/validators/producto-uniqueness.validator.ts
import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IProductoRepository } from '../../domain/interfaces/producto.repository-interface';


@Injectable()
export class ProductoUniquenessValidator {

  private readonly logger = new Logger(ProductoUniquenessValidator.name);

  constructor(
    @Inject('IProductoRepository')
    private readonly repository: IProductoRepository,
  ) {}

  /**
   * Valida que la denominación sea única
   * @param denominacion - Denominación a validar
   * @param excludeId - ID a excluir (para updates)
   */
  async validarDenominacionUnica(
    denominacion: string,
    excludeId?: number,
  ): Promise<void> {
    const existingProduct = await this.repository.existsByDenominacion(
      denominacion,
      excludeId,
    );

    if (existingProduct) {
      this.logger.warn(
        `Producto - Denominación duplicada: "${denominacion}"`,
      );
      throw new ConflictException(
        `La denominación "${denominacion}" ya está en uso`,
      );
    }
  }

  async  validarCodigoProveedorUnico(codigoProveedor: string, excludeId: number,) {
    const existingProduct = await this.repository.existsByCodigoProveedor(
      codigoProveedor,
      excludeId,
    );

    if (existingProduct) {
      this.logger.warn(
        `Producto - codigo duplicado: "${codigoProveedor}"`,
      );
      throw new ConflictException(
        `El codigo  "${codigoProveedor}" ya está en uso`,
      );
    }
  }
}