import { PartialType } from '@nestjs/mapped-types';
import { CreateLineaDto } from './create-linea.dto';
import { IsNotEmpty, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateLineaDto extends PartialType(CreateLineaDto) {

    @IsBoolean()
    utilizaStockMinimo: boolean;

    updatedAt: Date;

    @IsOptional()
    @IsInt({ message: 'El ID de superlínea debe ser un número entero.' })
    superLineaId?: number;

    @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
    usuarioUpdatedId: number;
}
