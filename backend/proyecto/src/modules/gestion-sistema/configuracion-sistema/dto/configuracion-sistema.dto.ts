import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class ConfiguracionSistemaDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la configuración del sistema',
  })
  @IsInt()
  id: number;

  @ApiProperty({ example: 5, description: 'ID de la empresa relacionada' })
  @IsInt()
  @IsNotEmpty()
  empresaId: number;

  @ApiProperty({
    example: true,
    description: 'Indica si se permite precio de oferta',
  })
  @IsBoolean()
  ocultarTotalesDocumento: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si se permite precio de oferta',
  })
  @IsBoolean()
  precioOferta: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si se permite precio con iva visible ',
  })
  @IsBoolean()
  precioConIvaVisible: boolean;

  @ApiProperty({
    example: 30,
    description: 'porcentaje de aumiento del precio, sobre el costo',
  })
  @IsInt()
  porcentajeAumento: number; // Ej:a 8%

  @ApiProperty({
    example: 9999,
    description: 'Límite del código del proveedor',
  })
  @IsInt()
  @IsPositive()
  caracteresParaBusqueda: number;

  @ApiProperty({
    example: 15,
    description: 'Cuantos elemestos por defualt trae en la busqueda ',
  })
  @IsInt()
  @IsPositive()
  take: number;

  @ApiProperty({ example: 9999, description: 'maximo dolar' })
  @IsNumber()
  maximoDolar: number;

  @ApiProperty({
    example: true,
    description: 'cuando abre la pantalla trae o no elementos',
  })
  @IsBoolean()
  busquedaInicial: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si es libro de caja es unico por empresa',
  })
  @IsBoolean()
  libroCajaUnica: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si la cartera de cheque  es unico por empresa',
  })
  @IsBoolean()
  carteraChequeUnica: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si es visible subtotal no gravado es visible',
  })
  @IsBoolean()
  visibleSubTotalNoGravado: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si es visible subtotales visible',
  })
  @IsBoolean()
  visibleSubTotal: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si es visible iva 105  visible',
  })
  @IsBoolean()
  visibleIva105: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si es visible subtotales visible',
  })
  @IsBoolean()
  visibleIva21: boolean;

  /* Producto*/
  @ApiProperty({ example: true, description: 'en producto trae estadisticas´' })
  @IsBoolean()
  estadisticasProducto: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica si producto posee unidad medida ',
  })
  @IsBoolean()
  unidadMedida: boolean;

  /**
   * Ojo es si se visualiza o no el atributo costo en dolar
   *
   */

  @ApiProperty({
    example: true,
    description: 'Indica si producto  visualiza costo en dolares ',
  })
  @IsBoolean()
  costoDolar: boolean;

  /* cliente */
  @ApiProperty({
    example: true,
    description:
      'Indica si la empresa trabaja que al cliente se le asigna al vendedor/personal',
  })
  @IsBoolean()
  clientePoseePersonal: boolean;



  @ApiProperty({
    example: true,
    description:
      'Indica si la empresa trabaja con documentos electrónicos',
  })
  @IsBoolean()
  electronica: boolean;

}
