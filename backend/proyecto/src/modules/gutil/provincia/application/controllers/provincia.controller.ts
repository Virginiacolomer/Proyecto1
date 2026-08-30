import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Logger,
  Query,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { PaginationDto } from 'src/modules/common/dto/pagination.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { CreateProvinciaDto } from '../../dto/create-provincia.dto';
import { UpdateProvinciaDto } from '../../dto/update-provincia.dto';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { ProvinciaService } from '../services/provincia.service';

@ApiTags('GUtil')
@Controller('provincia')
@UseGuards(AuthGuard)
export class ProvinciaController {
  private readonly logger = new Logger(ProvinciaController.name);
  constructor(private readonly service: ProvinciaService) {}

  private readonly ENTITY_NAME = 'Provincia';

  @Post()
  @UsePipes(NormalizeDenominacionPipe)
  @Roles('Root', 'Administrador', 'Empleado')
  create(@Body() createDto: CreateProvinciaDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get()
  @Roles('Root', 'Administrador', 'Empleado')
  findAll(@Query() paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;
    this.logger.log(`Obteniendo elementos: skip=${skip}, take=${take}`);
    return this.service.findAll(skip, take);
  }

  @Get('search')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: PaginationWithDenominacionDto,
  ) {
    const { denominacion='', skip, take } = paginationDto;
    this.logger.log(`Buscando usuarios con denominación: ${denominacion}`);
    return this.service.findByDenominacionFiltered(denominacion, skip, take);
  }

  @Get('findAllFor')
  @Roles('Root', 'Administrador', 'Empleado')
  findAllFor() {
    return this.service.findAllFor();
  }

  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findOne(+id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProvinciaDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn(`Eliminando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.remove(id);
  }
}
