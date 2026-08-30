import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class SearchDocumentoDto {
    @IsNotEmpty({ message: 'El id del cliente o del proveedor.' }) 
    @ApiProperty({  description: 'id del cliente o proveedor del documento a buscar' })
    operadorId: number;  
    
    
    @IsNotEmpty({ message: 'El ide de la empresa  es obligatorio.' })
    @IsInt({ message: 'El id de la empresa debe ser un número entero.' })
    @ApiProperty({  description: 'id de la empresa que se busca los documentos' })
    empresaId: number;
}