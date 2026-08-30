import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ReferenciaDto {
  @ApiProperty({
    description: 'Identificador único de la entidad referenciada.',
    example: 1,
  })
  @IsNotEmpty({ message: 'El id es obligatorio.' })
  @IsInt({ message: 'El id debe ser un número entero.' })
  id: number;

  @ApiProperty({
    description: 'Denominación de la entidad referenciada.',
    example: 'Iveco',
  })
  @IsNotEmpty({ message: 'La denominación es obligatoria.' })
  @IsString({ message: 'La denominación debe ser una cadena de texto.' })
  denominacion: string;
}