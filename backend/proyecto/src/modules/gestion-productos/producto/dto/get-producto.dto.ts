import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
/*
Se Utiliza para la busqueda y llenado de la tabla
*/
export class GetProductoDto {
  @ApiProperty({ example: 123, description: 'ID del producto' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'Caja de tornillos',
    description:
      'Denominación o nombre del producto. Esta formado por la linea y la marca',
  })
  @IsString()
  denominacion: string;

  @ApiProperty({
    example: '1158 Caja de tornillos',
    description:
      'Codigo proveedor Denominación o nombre del producto. Esta formado por la linea y la marca',
  })
  @IsString()
  codigoProveedorDenominacion: string;

  @ApiProperty({ example: 'ABC-1234', description: 'Código del proveedor' })
  @IsString()
  codigoProveedor: string;

  @ApiProperty({ example: 'ABC-1234', description: 'Código del proveedor' })
  @IsString()
  proveedor: string;

  @ApiProperty({ example: 'ABC-1234', description: 'Código del proveedor' })
  @IsString()
  ubicacion: string;

  @ApiProperty({ example: 50, description: 'Cantidad en stock' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 299.99, description: 'Precio base del producto' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  alicuota: number;

  @ApiProperty({
    example: 299.99,
    description: 'Costo del producto',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costo: number;

  @ApiProperty({
    example: 249.99,
    description: 'Precio de oferta del producto (si aplica)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({
    example: 249.99,
    description: 'Precio de oferta del producto (si aplica)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioConIva: number;



  @ApiProperty({ example: 1, description: 'es de sistema de la exportacion' })
  @Type(() => Number)
  @IsNumber()
  sistema: number;

  @ApiProperty({
    example: '1158 Caja de tornillos',
    description: 'obsrvaciones del producto.',
  })
  @IsString()
  observacion: string;

  @ApiProperty({
    description: 'Indica si posee utiliza Stock minimo',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  utilizaStockMinimo: boolean;

  @ApiProperty({ example: 50, description: 'Cantidad en stock minimo' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockMinimo: number;

  @ApiProperty({
    description: 'Indica si posee utiliza Stock minimo',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  utilizaPack: boolean;

  @ApiProperty({ example: 50, description: 'Cantidad en stock minimo' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidadPorPack: number;

  @IsString()
  codigoReferencia: string;


}
