import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ example: 0, description: 'Cantidad de elementos a omitir' })
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ example: 10, description: 'Cantidad de elementos a retornar' })
  take?: number;
}