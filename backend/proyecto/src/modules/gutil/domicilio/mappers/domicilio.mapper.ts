import { Domicilio } from '../entities/domicilio.entity';
import { DomicilioDto } from '../dto/domicilio.dto';

export class DomicilioMapper {
  static toDto(entity: Domicilio): DomicilioDto {
    return {
      id: entity.id,
      direccion: entity.direccion ?? '',

      localidadId: entity.localidad?.id ?? null,
      localidad: entity.localidad?.denominacion ?? '',
      provinciaId: entity.localidad?.provincia?.id ?? null,
      provincia: entity.localidad?.provincia?.denominacion ?? '',
    };
  }

  static toString(entity: Domicilio): string {
    const direccion = entity.direccion ?? '';
    const localidad = entity.localidad?.denominacion ?? '';
    const provincia = entity.localidad?.provincia?.denominacion ?? '';

    return `${direccion} ${localidad} ${provincia}`.trim();
  }
}
