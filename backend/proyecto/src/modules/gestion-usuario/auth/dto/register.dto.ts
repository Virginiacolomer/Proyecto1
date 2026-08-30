import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class RegistrarUsuarioDto {

  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  contrasena: string;

  @IsNumber()
  @IsNotEmpty()
  rolId: number;

  @IsString()
  @IsNotEmpty()
  denominacion: string;
}
