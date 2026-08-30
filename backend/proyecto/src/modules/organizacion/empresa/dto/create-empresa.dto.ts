import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MaxLength, Matches, IsOptional, Length, IsInt } from "class-validator";


export class CreateEmpresaDto {

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
    @Length(1, 255)
    cuit?: string;

    @IsNotEmpty({ message: 'La Categoria IVA es obligatoria.' })
    @IsInt({ message: 'La Categoria IVA  debe ser un número entero.' })
    condicionIVAId: number

    @IsOptional()
    @IsString()
    observacion?: string;

    createdAt: Date;

    @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
    usuarioCreatedId: number;


}
