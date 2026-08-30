import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, IsNumber, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateUsuarioDto {

  @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
  usuarioUpdatedId: number;


  @IsOptional()
  @IsEmail()
  mail?: string;

  @IsOptional()
  @IsString()
  denominacion?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  rolesIds?: number[];

}
