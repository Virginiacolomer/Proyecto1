import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

export class ImpresionListaProveedorDto {
  @IsArray()
  @IsString({ each: true })
  columnas: string[];

  @Type(() => Number)
  @IsNumber()
  empresaId: number;

  @IsString()
  denominacion: string;
}
