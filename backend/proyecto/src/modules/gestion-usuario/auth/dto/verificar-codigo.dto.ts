import { IsEmail, IsString, Length } from 'class-validator';

export class VerificarCodigoDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  mail: string;

  @IsString({ message: 'El código debe ser una cadena' })
  @Length(6, 6, { message: 'El código debe tener exactamente 6 caracteres' })
  codigo: string;
}
