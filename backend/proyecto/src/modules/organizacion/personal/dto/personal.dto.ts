import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  ValidateNested,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { ReferenciaDto } from 'src/modules/common/dto/referencia.dto';
import { CreateDomicilioDto } from 'src/modules/gutil/domicilio/dto/create-domicilio.dto';
import { DomicilioDto } from 'src/modules/gutil/domicilio/dto/domicilio.dto';

export class PersonalDto {
  
 @ApiProperty({
    example: 123,
    description: 'ID de del personal',
  })
  @IsInt()
  @Type(() => Number)
  id: number;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString({ message: 'La denominación debe ser una cadena de texto.' }) // Valida que sea string
  @IsNotEmpty({ message: 'La denominación no puede estar vacía.' }) // Valida que no esté vacía
  @MaxLength(255, { message: 'La denominación no puede estar vacía.' })
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La denominación solo puede contener letras, números y espacios.',
  })
  denominacion: string;
 
  @IsEmail()
   mail: string;

  @IsBoolean()
  esVendedor: boolean;

  @IsOptional()
  @IsString()
  observacion?: string;

  createdAt: Date;

 
}
