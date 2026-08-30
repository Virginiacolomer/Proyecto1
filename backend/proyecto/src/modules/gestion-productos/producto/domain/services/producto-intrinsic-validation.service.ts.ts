// domain/services/producto-intrinsic-validation.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductoIntrinsicValidationService {
  /**
   * Valida todos los datos intrínsecos del producto
   */
  validarDatosBasicos(datos: {
    denominacion: string;
    marcaId: number;
    lineaId: number;
    alicuotaIva?: number;
    precioMayorista?: number;
    precioCliente?: number;
    precioOcasional?: number;
  }): void {
    this.validarDenominacion(datos.denominacion);
    this.validarIds(datos.marcaId, datos.lineaId);
    this.validarPrecios(
      datos.precioMayorista,
      datos.precioCliente,
      datos.precioOcasional,
    );
    
    if (datos.alicuotaIva !== undefined) {
      this.validarAlicuotaIva(datos.alicuotaIva);
    }
  }

  private validarDenominacion(denominacion: string): void {
    if (!denominacion || denominacion.trim().length === 0) {
      throw new BadRequestException('La denominación es obligatoria');
    }
    if (denominacion.length > 200) {
      throw new BadRequestException(
        'La denominación no puede superar 200 caracteres',
      );
    }
  }

  private validarIds(
    marcaId: number,
    lineaId: number,
  ): void {
    if (!marcaId || marcaId <= 0) {
      throw new BadRequestException('Marca ID es requerido y debe ser válido');
    }
    if (!lineaId || lineaId <= 0) {
      throw new BadRequestException('Línea ID es requerido y debe ser válido');
    }

  }

  /**
   * Valida la jerarquía de precios: Mayorista <= Cliente <= Ocasional
   */
  private validarPrecios(
    precioMayorista?: number,
    precioCliente?: number,
    precioOcasional?: number,
  ): void {
    if (precioMayorista !== undefined && precioMayorista < 0) {
      throw new BadRequestException(
        'El precio mayorista no puede ser negativo',
      );
    }
    if (precioCliente !== undefined && precioCliente < 0) {
      throw new BadRequestException('El precio cliente no puede ser negativo');
    }
    if (precioOcasional !== undefined && precioOcasional < 0) {
      throw new BadRequestException(
        'El precio ocasional no puede ser negativo',
      );
    }

    // Validar jerarquía: Mayorista <= Cliente <= Ocasional
    if (precioMayorista && precioCliente) {
      if (precioMayorista > precioCliente) {
        throw new BadRequestException(
          'El precio Mayorista no puede superar el precio Cliente',
        );
      }
    }

    if (precioCliente && precioOcasional) {
      if (precioCliente > precioOcasional) {
        throw new BadRequestException(
          'El precio Cliente no puede superar el precio Ocasional',
        );
      }
    }

    if (precioMayorista && precioOcasional) {
      if (precioMayorista > precioOcasional) {
        throw new BadRequestException(
          'El precio Mayorista no puede superar el precio Ocasional',
        );
      }
    }
  }

  private validarAlicuotaIva(alicuotaIva: number): void {
    if (alicuotaIva < 0 || alicuotaIva > 100) {
      throw new BadRequestException(
        'La alícuota IVA debe estar entre 0 y 100',
      );
    }
  }
}