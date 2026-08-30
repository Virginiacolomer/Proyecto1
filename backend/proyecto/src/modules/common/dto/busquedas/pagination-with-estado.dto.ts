import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationWithEstadoDto {
  @IsDate()
  @Type(() => Date)
  fechaDesde: Date;

  @IsDate()
  @Type(() => Date)
  fechaHasta: Date;

  @IsInt()
  estado: number = -1;

  @IsInt()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  @Type(() => Number)
  skip: number = 0;

  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  take: number = 10;
}