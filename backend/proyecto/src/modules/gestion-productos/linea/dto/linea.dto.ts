import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LineaDto {
  @ApiProperty({ example: 123, description: 'ID del la linea' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'tornillos',
    description: 'Denominación o nombre dela linea',
  })
  @IsString()
  denominacion: string;

  @IsOptional()
  @IsInt()
  stockMinimo?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  utilizaStockMinimo: boolean;

  @ApiProperty({
    example: '',
    description: 'Observaciones varias sobre la linea',
  })
  @IsString()
  observacion: string;

  @ApiProperty({
    example: 1,
    description: 'de sistema no se puede editar ni eliminar',
  })
  @Type(() => Number)
  @IsInt()
  sistema: number;

  @ApiProperty({ example: null, description: 'Fecha de eliminación (null si está activa)', nullable: true })
  @IsOptional()
  deletedAt: string | null;

}
