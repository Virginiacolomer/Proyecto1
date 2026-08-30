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
  Max,
  IsEmail,
} from 'class-validator';
import { CondicionIvaValidable } from 'src/modules/gutil/condicion-iva/domain/interfaces/condicion-iva-validable.inteface';
import { CreateDomicilioDto } from 'src/modules/gutil/domicilio/dto/create-domicilio.dto';

export class CreateClienteDto implements CondicionIvaValidable {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString({ message: 'La denominación debe ser una cadena de texto.' }) // Valida que sea string
  @IsNotEmpty({ message: 'La denominación no puede estar vacía.' }) // Valida que no esté vacía
  @MaxLength(255, { message: 'La denominación no puede estar vacía.' })
  @Matches(/^[\w áéíóúÁÉÍÓÚñÑ.\-/%]+$/, {
    message: 'La denominación contiene caracteres inválidos ',
  })
  denominacion: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  denominacionAfip?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    example: '134',
    description: 'por el momento va a tomar el id',
  })
  codigo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  cuit?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  dni?: string;

  @IsNotEmpty({ message: 'La Condicion IVA es obligatoria.' })
  @IsInt({ message: 'La Condicion IVA  debe ser un número entero.' })
  condicionIvaId: number;

  @IsNotEmpty({ message: 'El personal es obligatorio.' })
  @IsInt({ message: 'El personal es obligatorio.' })
  vendedorId: number;

  @IsNotEmpty({ message: 'El domicilio es obligatorio.' })
  @Type(() => CreateDomicilioDto)
  domicilio: CreateDomicilioDto;
 
  @IsOptional()
  @IsEmail()
  mail?: string;


  @IsOptional()
  @IsString()
  celular?: string ;


  @IsOptional()
  @IsString()
  contactoNombre?: string | null; // persona de contacto


  @IsOptional()
  @IsString()
  contactoCargo?: string | null;




  @IsOptional()
  @IsString()
  observacion?: string;

  createdAt: Date;

  @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
  usuarioCreatedId: number;
}
