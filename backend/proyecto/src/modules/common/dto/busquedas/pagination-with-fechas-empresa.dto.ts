import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationEmpresaFechasDto } from './pagination-empresa-fechas.dto';

export class PaginationWithFechasEmpresaDto extends PaginationEmpresaFechasDto {

  @ApiProperty({
    description: 'ID de la empresa. Si no se envía, toma el valor 0.',
    example: 1,
    required: false,
    default: 0,
  })
  @IsInt()
  @Type(() => Number)
  operadorId: number = 0;

  @ApiProperty({
    description: 'ID de la empresa. Si no se envía, toma el valor 0.',
    example: 1,
    required: true,
    default: 0,
  })
  @IsInt()
  @Type(() => Number)
  orden: number = 0; //0=ascendente, 1=descendente

  @ApiProperty({
    description: 'ID de la empresa. Si no se envía, toma el valor 0.',
    example: 1,
    required: true,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  estado?: number = 0; //0=ascendente, 1=descendente
}
