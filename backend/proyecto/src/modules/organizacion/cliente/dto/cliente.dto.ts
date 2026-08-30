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
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ReferenciaDto } from 'src/modules/common/dto/referencia.dto';
import { CreateDomicilioDto } from 'src/modules/gutil/domicilio/dto/create-domicilio.dto';

export class ClienteDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString({ message: 'La denominación debe ser una cadena de texto.' }) // Valida que sea string
  @IsNotEmpty({ message: 'La denominación no puede estar vacía.' }) // Valida que no esté vacía
  @MaxLength(255, { message: 'La denominación no puede estar vacía.' })
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La denominación solo puede contener letras, números y espacios.',
  })
  denominacion: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  denominacionAfip?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  cuit?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  dni?: string;

  @ApiProperty({
    type: () => ReferenciaDto,
    description: 'Condicion IVA',
    required: true,
  })
  @ValidateNested()
  @Type(() => ReferenciaDto)
  condicionIva: ReferenciaDto;

  @ApiProperty({
    type: () => ReferenciaDto,
    description: 'Zona',
    required: true,
  })
  @ValidateNested()
  @Type(() => ReferenciaDto)
  personal: ReferenciaDto;

  @IsNotEmpty({ message: 'El domicilio es obligatorio.' })
  @Type(() => CreateDomicilioDto)
  domicilio: CreateDomicilioDto;

  @IsString()
  domicilioString: string;

  @ApiProperty()
  @IsBoolean()
  requiereCuit:boolean; 

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsString()
  contactoNombre?: string | null;

  @IsOptional()
  @IsString()
  contactoCargo?: string | null;
    
  @ApiProperty()
  @IsBoolean()
  requiereDocumento:boolean;

  @IsOptional()
  @IsString()
  observacion?: string;

  createdAt: Date;

  @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
  usuarioCreatedId: number;
}
