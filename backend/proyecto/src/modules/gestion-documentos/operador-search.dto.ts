import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ReferenciaDto } from '../common/dto/referencia.dto';

export class OperadorSearchDto {
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
  domicilioString: string;

  @ApiProperty()
  condicionIva: string;

  @ApiProperty()
  saldo: number;

  @ApiProperty()
  sistema: number;

  @ApiProperty({
    type: () => ReferenciaDto,
    description: 'Vendedor asociada al cliente',
    required: true,
  })
  @ValidateNested()
  @Type(() => ReferenciaDto)
  vendedor: ReferenciaDto;

  @ApiProperty({
    description: 'Indica si es proveevor materia prima',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  esProveedorMateriaPrima?: boolean;

  @IsOptional()
  @IsBoolean()
  esProveedorGastos?: boolean;
}
