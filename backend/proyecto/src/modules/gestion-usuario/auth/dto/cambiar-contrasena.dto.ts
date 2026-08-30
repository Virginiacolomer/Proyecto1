import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CambiarContrasenaDto {
  @IsEmail()
  mail: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  nuevaContrasena: string;
}