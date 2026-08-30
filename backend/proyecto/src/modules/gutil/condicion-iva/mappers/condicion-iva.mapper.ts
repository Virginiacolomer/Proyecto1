
import { CondicionIva } from "../domain/entities/condicion-iva.entity";
import { CondicionIvaDto } from "../dto/condicion-iva.dto";

export class CondicionIvaMapper {
  static toDto(entity:CondicionIva): CondicionIvaDto {
   

    return {
      id: entity.id,
      denominacion: entity.denominacion ?? '',
      letra: entity.letra ?? '',
      observacion: entity.observacion ?? '',
      requiereCuit: entity.requiereCuit ?? false, 
      requiereDocumento: entity.requiereDocumento ?? false,
      sistema: entity.sistema
    };
  }
}