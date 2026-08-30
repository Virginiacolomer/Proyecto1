import { IsString, IsNotEmpty, Length, IsNumber } from "class-validator";

export class LoginDto {

  @IsString()
  @IsNotEmpty({ message: 'El mail no puede estar vacío.' })
  mail: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @Length(8, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres.' })
  contrasena: string;

  @IsNotEmpty({ message: 'El id de la empresa no puede estar vacío.' })
  @IsNumber()
  empresaId: number;
  
}