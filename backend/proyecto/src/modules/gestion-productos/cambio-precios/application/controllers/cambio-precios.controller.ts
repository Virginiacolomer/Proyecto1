import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { CambioPreciosService } from '../services/cambio-precios.service';
import { SimularAumentoMasivoDto } from '../../dto/simular-aumento-masivo.dto';
import { AplicarAumentoMasivoDto } from '../../dto/aplicar-aumento-masivo.dto';

/**
 * Decisión de diseño #10: los dos pasos (previsualizar y confirmar) quedan
 * restringidos a Administrador. No tendría sentido que otro rol pueda ver
 * la previsualización si después no la puede guardar.
 */
@ApiTags('Gestion Productos')
@Controller('cambio-precios')
@UseGuards(AuthGuard)
export class CambioPreciosController {
  private readonly logger = new Logger(CambioPreciosController.name);

  constructor(private readonly service: CambioPreciosService) {}

  @Post('simular')
  @Roles('Administrador')
  simular(@Body() dto: SimularAumentoMasivoDto) {
    this.logger.log(
      `Simulando aumento masivo: tipoAjuste=${dto.tipoAjuste} valor=${dto.valor} lineaId=${dto.lineaId} marcaId=${dto.marcaId}`,
    );
    return this.service.simular(dto);
  }

  @Post('aplicar')
  @Roles('Administrador')
  aplicar(@Body() dto: AplicarAumentoMasivoDto) {
    this.logger.log(
      `Aplicando aumento masivo: tipoAjuste=${dto.tipoAjuste} valor=${dto.valor} lineaId=${dto.lineaId} marcaId=${dto.marcaId} usuario=${dto.usuarioCreatedId}`,
    );
    return this.service.aplicar(dto);
  }
}
