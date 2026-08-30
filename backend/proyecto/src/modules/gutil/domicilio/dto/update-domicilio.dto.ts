import { PartialType } from '@nestjs/mapped-types';
import { CreateDomicilioDto } from './create-domicilio.dto';
import { IsInt, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateDomicilioDto extends PartialType(CreateDomicilioDto) {

  @IsString({ message: 'La dirección debe ser un string' })
  direccion?: string;

  @ValidateIf((o) => o.localidadId !== undefined)
  @IsInt({ message: 'El ID de la localidad debe ser un número entero' })
  localidadId?: number;
}
