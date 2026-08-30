import { IsEmail } from 'class-validator';

export class RecuperarPasswordDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  mail: string;
}
