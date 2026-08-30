import { Localidad } from '../domain/entities/localidad.entity';
import { LocalidadDto } from '../dto/localidad.dto';
import { toReferenciaDto } from 'src/modules/common/utils/mappers/referencia.mapper';

export class LocalidadMapper {
  static toDto(entity: Localidad): LocalidadDto {
    return {
      id: entity.id,
      denominacion: entity.denominacion ?? '',
      codigoPostal: entity.codigoPostal ?? '',
      sistema: entity.sistema ?? 0,
      provincia: toReferenciaDto(entity.provincia),
      deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
    };
  }
}
