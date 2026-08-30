import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDomicilioDto } from 'src/modules/gutil/domicilio/dto/update-domicilio.dto';
import { CondicionIvaValidable } from 'src/modules/gutil/condicion-iva/domain/interfaces/condicion-iva-validable.inteface';

class CreateClienteDtoSinDomicilio extends OmitType(CreateClienteDto, ['domicilio'] as const) {}

export class UpdateClienteDto extends PartialType(CreateClienteDtoSinDomicilio) implements CondicionIvaValidable {

    @IsNotEmpty({ message: 'La Condicion IVA es obligatoria.' })
    @IsInt({ message: 'La Condicion IVA  debe ser un número entero.' })
    condicionIvaId: number

    @IsNotEmpty({ message: 'El domicilio es obligatorio.' })
    @Type(() => UpdateDomicilioDto)
    domicilio: UpdateDomicilioDto;
    
    @IsNotEmpty({ message: 'El personal  es obligatoria.' })
    @IsInt({ message: 'El personal debe ser un número entero.' })
    vendedorId: number

    updatedAt: Date;

    @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
    usuarioUpdatedId: number;


}
