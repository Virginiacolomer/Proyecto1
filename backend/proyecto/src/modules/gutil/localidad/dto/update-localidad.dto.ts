import { PartialType } from '@nestjs/mapped-types';
import { CreateLocalidadDto } from './create-localidad.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateLocalidadDto extends PartialType(CreateLocalidadDto) {

    updatedAt: Date;
    
    @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
    usuarioUpdatedId: number;
}
