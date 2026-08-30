// domain/services/producto-validation.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { Linea } from 'src/modules/gestion-productos/linea/domain/entities/linea.entity';
import { Marca } from 'src/modules/gestion-productos/marca/domain/entities/marca.entity';

@Injectable()
export class ProductoValidationService {
  /**
   * Valida que las entidades relacionadas sean compatibles entre sí
   */
  validarEntidadesRelacionadas(
    marca: Marca,
    linea: Linea,

  ): void {
    this.validarEntidadNoEsDeSistema(marca, 'Marca');
    this.validarEntidadNoEsDeSistema(linea, 'Línea');

  }

  private validarEntidadNoEsDeSistema(
    entidad: { id: number; sistema?: number },
    tipo: string,
  ): void {
    if (entidad.sistema === 1) {
      throw new BadRequestException(
        `${tipo} ${entidad.id} está marcada como del sistema y no puede usarse`,
      );
    }
  }
}