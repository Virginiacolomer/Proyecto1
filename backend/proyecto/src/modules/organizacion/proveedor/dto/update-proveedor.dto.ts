import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProveedorDto } from './create-proveedor.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UpdateDomicilioDto } from 'src/modules/gutil/domicilio/dto/update-domicilio.dto';
import { CondicionIvaValidable } from 'src/modules/gutil/condicion-iva/domain/interfaces/condicion-iva-validable.inteface';

class CreateProveedorDtoSinDomicilio extends OmitType(CreateProveedorDto, [
  'domicilio',
] as const) {}

export class UpdateProveedorDto extends PartialType(CreateProveedorDtoSinDomicilio)
  implements CondicionIvaValidable
{

  @IsNotEmpty({ message: 'La Condicion IVA es obligatoria.' })
  @IsInt({ message: 'La Condicion IVA  debe ser un número entero.' })
  condicionIvaId: number;

  @IsNotEmpty({ message: 'El domicilio es obligatorio.' })
  @Type(() => UpdateDomicilioDto)
  domicilio: UpdateDomicilioDto;

  updatedAt: Date;

  @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId: number;
}
