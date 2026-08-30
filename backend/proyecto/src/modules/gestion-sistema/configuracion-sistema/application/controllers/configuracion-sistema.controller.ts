import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ConfiguracionSistemaDto } from '../../dto/configuracion-sistema.dto';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { ConfiguracionSistemaService } from '../services/configuracion-sistema.service';

@ApiTags('Organizacion')
@Controller('configuracion-sistema')
@UseGuards(AuthGuard)
export class ConfiguracionSistemaController {
  constructor(private readonly service: ConfiguracionSistemaService) {}

  @Get(':empresaId')
  @Roles('Root', 'Administrador', 'Empleado', 'Vendedor', 'Cobrador')
  getConfiguracionPorEmpresa(
    @Param('empresaId', ParseIntPipe) empresaId: number,
  ): Promise<ConfiguracionSistemaDto> {
    return this.service.findDtoByEmpresaId(empresaId);
  }
}
