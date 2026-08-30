import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

export class ImpresionListaClienteDto {
  @IsArray()
  columnas: { accessor: string; header: string }[];

  @Type(() => Number)
  @IsNumber()
  empresaId: number;

  @IsString()
  denominacion: string;
}
