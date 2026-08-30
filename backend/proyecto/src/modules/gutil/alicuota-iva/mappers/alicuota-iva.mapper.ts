import { AlicuotaIva } from "../domain/entities/alicuota-iva.entity";
import { AlicuotaIvaDto } from "../dto/alicuota-iva.dto";


export class AlicuotaIvaMapper {
  static toDto(entity:AlicuotaIva): AlicuotaIvaDto {
   
    return {
      id: entity.id,
      denominacion: entity.denominacion ?? '',
      alicuota: entity.alicuota,
      observacion: entity.observacion ?? '',
      sistema: entity.sistema
    };
  }
}