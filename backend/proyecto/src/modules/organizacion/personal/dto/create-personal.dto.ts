import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MaxLength, Matches, IsOptional, IsInt, IsEmail, IsBoolean } from "class-validator";
import { CondicionIvaValidable } from "src/modules/gutil/condicion-iva/domain/interfaces/condicion-iva-validable.inteface";


export class CreatePersonalDto {
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsString({ message: 'La denominación debe ser una cadena de texto.' }) // Valida que sea string
    @IsNotEmpty({ message: 'La denominación no puede estar vacía.' }) // Valida que no esté vacía
    @MaxLength(255, { message: 'La denominación no puede estar vacía.' })
    @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, {
        message: 'La denominación solo puede contener letras, números y espacios.',
    })
    denominacion: string;

    @IsEmail()
    mail: string;

    @IsBoolean()
    esVendedor: boolean;
    
    @IsOptional()
    @IsString()
    observacion?: string;

    createdAt: Date;

    @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
    usuarioCreatedId: number;

}
