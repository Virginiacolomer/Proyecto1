import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { FiltroAlcanceCambioPreciosDto } from './filtro-alcance-cambio-precios.dto';
import { TipoAjustePrecio } from '../domain/enums/tipo-ajuste-precio.enum';

/**
 * Decisión de diseño #1: un único DTO cubre tanto el aumento por porcentaje
 * como por monto fijo.
 */
export class SimularAumentoMasivoDto extends FiltroAlcanceCambioPreciosDto {
  @ApiProperty({ enum: TipoAjustePrecio, example: TipoAjustePrecio.PORCENTAJE })
  @IsEnum(TipoAjustePrecio, {
    message: 'tipoAjuste debe ser PORCENTAJE o MONTO_FIJO',
  })
  tipoAjuste: TipoAjustePrecio;

  @ApiProperty({ example: 10, description: 'Porcentaje (ej. 10) o monto fijo (ej. 150) a aplicar' })
  @IsNumber()
  @IsPositive({ message: 'El valor del aumento debe ser mayor a 0' })
  valor: number;
}
