import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

/**
 * Decisión de diseño #9: el alcance de un aumento masivo se define con los
 * mismos filtros que ya usa la búsqueda de productos (línea / marca). Sin
 * ninguno de los dos, el alcance son todos los productos activos.
 */
export class FiltroAlcanceCambioPreciosDto {
  @ApiPropertyOptional({ example: 3, description: 'Limita el alcance a una línea puntual' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  lineaId?: number;

  @ApiPropertyOptional({ example: 7, description: 'Limita el alcance a una marca puntual' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  marcaId?: number;
}
