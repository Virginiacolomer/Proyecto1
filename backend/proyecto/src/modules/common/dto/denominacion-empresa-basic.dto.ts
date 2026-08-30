import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DenominacionEmpresaBasicDto {
  @IsOptional()
  @IsString()
  denominacion?: string;

  @IsInt()
  @Type(() => Number)
  empresaId: number = 0;

}