import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DenominacionEmpresaOperadorUsuarioDto {
  @IsOptional()
  @IsString()
  denominacion?: string;

  @IsInt()
  @Min(1, { message: 'empresaId debe ser un número entero mayor que 0' })
  @Type(() => Number)
  empresaId: number = 0;

  @IsInt()
  @Type(() => Number)
  condicionIvaId: number = 0;

  @IsInt()
  @Type(() => Number)
  usuarioId: number = 0;

  @IsInt()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  @Type(() => Number)
  skip: number = 0;

  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  take: number = 10;
}