import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DomicilioDto } from '../gutil/domicilio/dto/domicilio.dto';
import { ReferenciaDto } from '../common/dto/referencia.dto';
import { CondicionIvaDto } from '../gutil/condicion-iva/dto/condicion-iva.dto';

export class OperadorDto {
  @ApiProperty({
    example: 123,
    description: 'ID de del cliente o proveedor',
  })
  @IsInt()
  @Type(() => Number)
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Razon social del cliente yo proveedor',
  })
  denominacion: string;

  @ApiProperty({
    type: 'string',
    description: 'Razon social del cliente yo proveedor',
  })
  codigo: string;
  
  @ApiProperty({
    type: 'string',
    description: 'Razon social del cliente yo proveedor',
  })
  denominacionAfip: string;

  @ApiProperty({
    type: 'string',
    description: 'Razon social del cliente yo proveedor',
  })
  observacion: string;


  @ApiProperty()
  letra: string;

  @ApiProperty()
  cuit: string;

  @ApiProperty()
  dni: string;

  @ApiProperty()
  mail: string;

  @ApiProperty({
    type: () => ReferenciaDto,
    description: 'Categoria iva',
    required: true,
  })
  @ValidateNested()
  @Type(() => CondicionIvaDto)
  condicionIva: CondicionIvaDto;

  @ApiPropertyOptional({
    type: () => ReferenciaDto,
    description: 'vendedor',
    required: true,
  })
  @ValidateNested()
  @Type(() => ReferenciaDto)
  vendedor?: ReferenciaDto;


  @ApiPropertyOptional({ type: () => DomicilioDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DomicilioDto)
  domicilio?: DomicilioDto;

  @IsString()
  domicilioString: string;

  @ApiProperty()
  saldo: number;

  @ApiProperty()
  sistema: number;
}
