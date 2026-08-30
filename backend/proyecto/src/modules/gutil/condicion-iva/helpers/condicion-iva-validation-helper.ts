import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CondicionIvaService } from 'src/modules/gutil/condicion-iva/application/services/condicion-iva.service';
import { CondicionIvaValidable } from '../domain/interfaces/condicion-iva-validable.inteface';
import { CondicionIva } from '../domain/entities/condicion-iva.entity';

@Injectable()
export class CondicionIvaValidationHelper {
  constructor(private readonly condicionIvaService: CondicionIvaService) {}

  async validateAndGetCondicionIva(
    condicionIvaId: number,
  ): Promise<CondicionIva> {
    const categoriaIVA =
      await this.condicionIvaService.findEntityById(condicionIvaId);
    if (!categoriaIVA) {
      throw new NotFoundException(
        `Condición IVA con ID ${condicionIvaId} no encontrada`,
      );
    }
    return categoriaIVA;
  }

  validateCondicionIvaRequirements(
    categoriaIVA: CondicionIva,
    dto: CondicionIvaValidable,
  ): void {
    if (categoriaIVA.requiereCuit) {
      if (!dto.cuit) {
        throw new BadRequestException({
          error: 'CUIT requerido',
          message: `La condición IVA '${categoriaIVA.denominacion}' requiere un CUIT.`,
        });
      }

      if (!this.isValidCuit(dto.cuit)) {
        throw new BadRequestException({
          error: 'CUIT inválido',
          message: `El CUIT proporcionado no es válido.`,
        });
      }
    }

    if (categoriaIVA.requiereDocumento && !dto.dni) {
      
      throw new BadRequestException({
        error: 'DNI requerido',
        message: `La condición IVA '${categoriaIVA.denominacion}' requiere DNI.`,
      });

    }
    
  }

  private isValidCuit(cuit: string): boolean {
    if (!cuit || cuit.length !== 11 || !/^\d+$/.test(cuit)) {
      return false;
    }
    // Algoritmo de validación de CUIT (ejemplo simplificado)
    const digits = cuit.split('').map(Number);
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const sum = digits
      .slice(0, 10)
      .reduce((acc, digit, i) => acc + digit * weights[i], 0);
    const checksum = (11 - (sum % 11)) % 11;
    return checksum === digits[10];
  }
}
