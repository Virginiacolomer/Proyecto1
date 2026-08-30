import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsOptional,
  Length,
  IsInt,
  ValidateNested,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { ReferenciaDto } from 'src/modules/common/dto/referencia.dto';
import { CondicionIvaValidable } from 'src/modules/gutil/condicion-iva/domain/interfaces/condicion-iva-validable.inteface';
import { CreateDomicilioDto } from 'src/modules/gutil/domicilio/dto/create-domicilio.dto';

export class CreateProveedorDto implements CondicionIvaValidable {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    example: '134',
    description: 'por el momento va a tomar el id',
  })
  codigoProveedor?: string;


  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString({ message: 'La denominación debe ser una cadena de texto.' }) // Valida que sea string
  @IsNotEmpty({ message: 'La denominación no puede estar vacía.' }) // Valida que no esté vacía
  @MaxLength(255, { message: 'La denominación no puede estar vacía.' })
  @Matches(/^[\w áéíóúÁÉÍÓÚñÑ.\-/%]+$/, {
    message: 'La denominación contiene caracteres inválidos ',
  })
  @ApiProperty({
    example: 'Proveedor S.A.',
    description: 'Nombre del proveedor',
  })
  denominacion: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    example: 'Proveedor S.A.',
    description: 'Nombre legal del proveedor',
  })
  denominacionAfip?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    example: 'CUIT',
    description: 'Tipo de identificación fiscal',
  })
  cuit?: string;

  @IsNotEmpty({ message: 'La Categoria IVA es obligatoria.' })
  @IsInt({ message: 'La Categoria IVA  debe ser un número entero.' })
  condicionIvaId: number;

  @IsNotEmpty({ message: 'El domicilio es obligatorio.' })
  @Type(() => CreateDomicilioDto)
  domicilio: CreateDomicilioDto;

  @IsNotEmpty({ message: 'El campo proveedor materia prima es obligatorio.' })
  @IsBoolean({ message: 'El campo proveedor materia prima debe ser booleano.' })
  @Type(() => Boolean)
  esProveedorMateriaPrima: boolean;

  @IsNotEmpty({ message: 'El campo proveedor de gastos es obligatorio.' })
  @IsBoolean({ message: 'El campo proveedor gastos debe ser booleano.' })
  @Type(() => Boolean)
  esProveedorGastos: boolean;
   
  @IsOptional()
  @IsEmail()
  mail?: string;
       
  @IsOptional()
  @IsString()
  observacion?: string;

  createdAt: Date;

  @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
  usuarioCreatedId: number;
}
