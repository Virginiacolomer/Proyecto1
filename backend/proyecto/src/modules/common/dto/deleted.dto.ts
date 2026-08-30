import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeletedDto {
  
    @IsNotEmpty({ message: 'El id de la entidad a eliminar es obligatorio.' }) 
    @ApiProperty({  description: 'id de la entidad a eliminar' })
    id: number;  
    
    
    @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
    @ApiProperty({  description: 'id del usuario que elimina' })
    usuarioId: number;
}