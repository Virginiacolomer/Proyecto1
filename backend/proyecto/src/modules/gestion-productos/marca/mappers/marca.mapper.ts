import { Logger } from '@nestjs/common';
import { Marca } from '../domain/entities/marca.entity';
import { MarcaDto } from '../dto/marca.dto';

export class MarcaMapper {
  private static readonly logger = new Logger(MarcaMapper.name);

  static toDto(entity: Marca): MarcaDto {
    return {
      id: entity.id,
      denominacion: entity.denominacion,
      observacion: entity.observacion ?? "",
      sistema: entity.sistema,
      deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
    };
  }


}
