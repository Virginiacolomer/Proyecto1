import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  UsePipes,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateAlicuotaIvaDto } from '../../dto/create-alicuota-iva.dto';
import { UpdateAlicuotaIvaDto } from '../../dto/update-alicuota-iva.dto';
import { AlicuotaIvaService } from '../services/alicuota-iva.service';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { AlicuotaIvaDto } from '../../dto/alicuota-iva.dto';

@Controller('alicuota-iva')
export class AlicuotaIvaController {
  private readonly logger = new Logger(AlicuotaIvaController.name);
  constructor(private readonly service: AlicuotaIvaService) {}

  private readonly ENTITY_NAME = 'Alicuota IVA';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() createDto: CreateAlicuotaIvaDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: PaginationWithDenominacionDto,
  ) {
    const { denominacion = '', skip, take } = paginationDto;
    this.logger.log(
      `Buscando  ${this.ENTITY_NAME} con denominación: ${denominacion}`,
    );
    return this.service.findBy(denominacion, skip, take);
  }


  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({ type: AlicuotaIvaDto })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AlicuotaIvaDto> {
    this.logger.log(`Buscando ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findDtoById(id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAlicuotaIvaDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    this.logger.warn(
      `Eliminando ${this.ENTITY_NAME} con ID: ${id} por usuario: ${usuarioId}`,
    );
    return this.service.remove(id, usuarioId);
  }

  @Get(':id/audit')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({
    description: 'Informacion de auditoria',
    type: AuditoriaDto,
  })
  async findByIdConAuditoria(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditoriaDto> {
    const data = await this.service.findByIdConAuditoria(id);
    return data;
  }
}
