import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
} from 'class-validator';

export class ProvinciaDto {
  @ApiProperty({ example: 123, description: 'ID de la provincia' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'Córdoba',
    description: 'Denominación de la provincia',
  })
  @IsString()
  denominacion: string;


}