import { PartialType } from '@nestjs/mapped-types';
import { CreateCondicionIvaDto } from './create-condicion-iva.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCondicionIvaDto extends PartialType(CreateCondicionIvaDto) {

    updatedAt: Date;
   
    @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
    usuarioUpdatedId: number;
}