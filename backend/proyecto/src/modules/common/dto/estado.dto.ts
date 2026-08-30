import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EstadoDto {
  @ApiProperty({
    description: 'codigo del estado',
    example: 1,
  })
  @IsNotEmpty({ message: 'El codigo es obligatorio.' })
  @IsInt({ message: 'El codigo debe ser un número entero.' })
  codigo: number;

  @ApiProperty({
    description: 'Denominación del estado.',
    example: 'Activo',
  })
  @IsNotEmpty({ message: 'La denominación es obligatoria.' })
  @IsString({ message: 'La denominación debe ser una cadena de texto.' })
  denominacion: string;

  constructor(codigo: number, denominacion: string) {
    this.codigo = codigo;
    this.denominacion = denominacion;
  }
}