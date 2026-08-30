import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationEmpresaFechasDto } from './pagination-empresa-fechas.dto';

export class PaginationWithFechasEmpresaOperadorDto extends PaginationEmpresaFechasDto  {

 
  @ApiProperty({
    description:
      'El operador puede se cliente , proveedor si no va nada se pone 0',
    example: '1, 14 cuando no va nada 0',
  })
  @IsInt()
  @Type(() => Number)
  operadorId: number;

}
