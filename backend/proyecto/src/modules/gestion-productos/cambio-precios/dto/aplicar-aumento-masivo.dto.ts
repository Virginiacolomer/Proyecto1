import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { SimularAumentoMasivoDto } from './simular-aumento-masivo.dto';

/**
 * Decisión de diseño #8: el motivo es obligatorio, mismo criterio que
 * "Ajuste de stock" en el documento de dominio.
 */
export class AplicarAumentoMasivoDto extends SimularAumentoMasivoDto {
  @ApiProperty({ example: 'Actualización de lista de proveedor - septiembre 2026' })
  @IsString()
  @IsNotEmpty({ message: 'El motivo es obligatorio.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  motivo: string;

  @ApiProperty({ example: 3, description: 'Usuario que aplica el aumento' })
  @IsInt()
  usuarioCreatedId: number;
}
