import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class UsuarioDto {

    
    
    @IsNotEmpty({ message: 'El usuarioId es obligatorio.' })
    @IsInt({ message: 'El usuari d debe ser un número entero.' })
    @ApiProperty({  description: 'id del usuario' })
    usuarioId: number;
}