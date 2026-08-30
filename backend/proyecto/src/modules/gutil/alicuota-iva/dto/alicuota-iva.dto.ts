import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsString,
} from 'class-validator';

export class AlicuotaIvaDto {
  @ApiProperty({ example: 123, description: 'ID de la condición de IVA' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'Consumidor Final',
    description: 'Denominación de la condición de IVA',
  })
  @IsString()
  denominacion: string;

  @ApiProperty({ example: 0.21, description: 'la alicuota de la condición de IVA' })
  @Type(() => Number)
  @IsInt()
  alicuota: number;

  @ApiProperty({
    example: 'Consumidor Final',
    description: 'Denominación de la condición de IVA',
  })
  @IsString()
  observacion: string;


  @IsInt()
  sistema: number;
}