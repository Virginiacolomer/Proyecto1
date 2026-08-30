import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class DomicilioDto {
    @ApiProperty({
    description: 'ID del domicilio.',
    })
    id: number;

    @IsString()
    direccion: string;
  
    @IsInt()
    @Type(() => Number)
    localidadId: number;
   
    @IsString()
    localidad: string;

    @IsInt()
    @Type(() => Number)
    provinciaId: number;
   
    @IsString()
    provincia: string;

}
