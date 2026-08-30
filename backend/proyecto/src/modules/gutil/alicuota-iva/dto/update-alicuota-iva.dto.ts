import { PartialType } from '@nestjs/swagger';
import { CreateAlicuotaIvaDto } from './create-alicuota-iva.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateAlicuotaIvaDto extends PartialType(CreateAlicuotaIvaDto) {

    updatedAt: Date;
   
    @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
    usuarioUpdatedId: number;

}
