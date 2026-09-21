import { PartialType } from '@nestjs/mapped-types';
import { CreatePresentacionDto } from './create-presentacion.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePresentacionDto extends PartialType(CreatePresentacionDto) {

    updatedAt: Date;

    @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
    usuarioUpdatedId: number;

}
