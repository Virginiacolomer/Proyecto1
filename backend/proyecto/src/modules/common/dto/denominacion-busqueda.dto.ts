import { IsString } from 'class-validator';

export class DenominacionBusquedaDto {

  @IsString()
  denominacion?: string;


}