import { Type } from "class-transformer";
import { IsNumber, IsString, MinLength } from "class-validator";

export class UpdateContrasenaDto {


  @IsString()
  contrasenaActual: string;

  @IsString()
  @MinLength(8)
  contrasenaNueva: string;

  @IsString()
  confirmarContrasena: string;
}