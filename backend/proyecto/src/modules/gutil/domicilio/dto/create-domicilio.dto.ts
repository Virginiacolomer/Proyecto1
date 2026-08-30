import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateDomicilioDto {

    @IsString()
    @IsNotEmpty()
    direccion: string;
  
    @IsNotEmpty({ message: 'La localidad es obligatoria.' })
    @IsInt({ message: 'La localidad es obligatoria.' })
    localidadId: number;

}
