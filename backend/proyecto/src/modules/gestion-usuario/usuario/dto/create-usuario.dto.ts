import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {

  @IsString()
  @IsNotEmpty()
  denominacion: string;

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

  createdAt: Date


}
