import { Logger } from '@nestjs/common';
import { Presentacion } from '../domain/entities/presentacion.entity';
import { PresentacionDto } from '../dto/presentacion.dto';

export class PresentacionMapper {
  private static readonly logger = new Logger(PresentacionMapper.name);

  static toDto(entity: Presentacion): PresentacionDto {
    return {
      id: entity.id,
      denominacion: entity.denominacion,
      observacion: entity.observacion ?? "",
      sistema: entity.sistema,
      deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
    };
  }


}
