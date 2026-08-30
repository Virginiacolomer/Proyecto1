import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchLocalidadDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Denominación a filtrar' })
  denominacion: string;

  @ApiPropertyOptional({ description: 'id de provincia' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  provinciaId?: number;

  @IsInt()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 0,
    description: 'Cantidad de elementos a omitir',
  })
  skip: number = 0;

  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de elementos a retornar',
  })
  take: number = 10;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirEliminados?: boolean;
}
