import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsString,
} from 'class-validator';

export class CondicionIvaDto {
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

  @ApiProperty({
    example: 'A',
    description: 'Letra asociada a la condición de IVA',
  })
  @IsString()
  letra: string;

  @ApiProperty({
    example: 'Consumidor Final',
    description: 'Denominación de la condición de IVA',
  })
  @IsString()
  observacion: string;

  @ApiProperty({
    description: 'Indica si f CUIT ess requerido',
    type: Boolean
  })
  @IsBoolean()
  requiereCuit: boolean;

  @ApiProperty({
    description: 'Indica si documento es requerido',
    type: Boolean,
  })
  @IsBoolean()
  requiereDocumento: boolean;

 @IsInt()
  sistema: number;
}