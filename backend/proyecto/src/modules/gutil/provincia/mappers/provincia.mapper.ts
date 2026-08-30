
import { Provincia } from "../domain/entities/provincia.entity";
import { ProvinciaDto } from "../dto/provincia.dto";

export class ProvinciaMapper {
  static toDto(entity:Provincia): ProvinciaDto {
   
    return {
      id: entity.id,
      denominacion: entity.denominacion ?? '',

    };
  }
}