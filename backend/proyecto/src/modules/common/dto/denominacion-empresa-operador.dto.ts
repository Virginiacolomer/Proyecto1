import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class DenominacionEmpresaOperadorDto {
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
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  @Type(() => Number)
  skip: number = 0;

  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  take: number = 10;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  poseeSaldo?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirEliminados?: boolean;
}
