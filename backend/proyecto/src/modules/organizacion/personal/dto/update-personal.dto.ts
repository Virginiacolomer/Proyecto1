import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalDto } from './create-personal.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePersonalDto extends PartialType(CreatePersonalDto) {

    updatedAt: Date;
    
    @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
    usuarioUpdatedId: number;
}
