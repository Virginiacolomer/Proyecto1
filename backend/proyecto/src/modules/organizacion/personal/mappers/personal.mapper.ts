import { DomicilioMapper } from 'src/modules/gutil/domicilio/mappers/domicilio.mapper';
import { PersonalSearchDto } from '../dto/personal-search.dto';
import { PersonalDto } from '../dto/personal.dto';
import { Personal } from '../domain/entities/personal.entity';

export class PersonalMapper {
  static toSearchDto(entity: Personal): PersonalSearchDto {
    return {
      id: entity.id,
      denominacion: entity.denominacion ?? '',
      domicilioString: '',
      createdAt: entity.createdAt,
      sistema: entity.sistema,
      deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
    };
  }

  static toDto(personal: Personal): PersonalDto {
    return {
      id: personal.id,
      denominacion: personal.denominacion ?? '',
      observacion: personal.observacion ?? '',
      mail: personal.mail,
      esVendedor: personal.esVendedor,
      createdAt: personal.createdAt,
    };
  }
}
