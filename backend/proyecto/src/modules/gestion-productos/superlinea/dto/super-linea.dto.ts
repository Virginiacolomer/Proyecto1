import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SuperLineaDto {
  @ApiProperty({ example: 1, description: 'ID de la SuperLínea' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'Bebidas',
    description: 'Denominación o nombre de la SuperLínea',
  })
  @IsString()
  denominacion: string;

  @ApiProperty({
    example: 'Productos líquidos y refrescos',
    description: 'Observaciones sobre la SuperLínea',
  })
  @IsOptional()
  @IsString()
  observacion?: string;

  @ApiProperty({
    example: 0,
    description: 'Indica si es de sistema',
  })
  @Type(() => Number)
  @IsInt()
  sistema: number;

  @ApiProperty({ example: null, description: 'Fecha de eliminación (null si está activa)', nullable: true })
  @IsOptional()
  deletedAt?: string | null;
}
