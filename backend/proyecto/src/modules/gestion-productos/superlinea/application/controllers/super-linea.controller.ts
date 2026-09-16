import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  ParseIntPipe,
  Put,
  Query,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { SuperLineaService } from '../services/super-linea.service';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { SuperLineaDto } from '../../dto/super-linea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';

@ApiTags('Gestion Productos')
@Controller('superlinea')
@UseGuards(AuthGuard)
export class SuperLineaController {
  private readonly logger = new Logger(SuperLineaController.name);

  constructor(private readonly service: SuperLineaService) {}

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() createDto: CreateSuperLineaDto) {
    this.logger.log(`Creando un nuevo SuperLinea...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: PaginationWithDenominacionDto,
  ) {
    const { denominacion = '', skip, take, incluirEliminados } = paginationDto;
    return this.service.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  @Get('listado')
  @Roles('Root', 'Administrador', 'Empleado')
  findAllListado() {
    return this.service.findAllListado();
  }

  @Get(':id')
  @ApiOkResponse({ type: SuperLineaDto })
  @Roles('Root', 'Administrador', 'Empleado')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SuperLineaDto> {
    return this.service.findDtoById(+id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSuperLineaDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.service.remove(id, usuarioId);
  }

  @Get(':id/audit')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({
    description: 'Información de auditoría',
    type: AuditoriaDto,
  })
  async findByIdConAuditoria(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditoriaDto> {
    return this.service.findByIdConAuditoria(id);
  }
}
