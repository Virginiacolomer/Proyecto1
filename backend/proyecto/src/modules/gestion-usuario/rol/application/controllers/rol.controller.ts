import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UsePipes, Logger, Query, ParseIntPipe } from '@nestjs/common';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { CreateRolDto } from '../../dto/create-rol.dto';
import { PaginationDto } from 'src/modules/common/dto/pagination.dto';
import { UpdateRolDto } from '../../dto/update-rol.dto';
import { AuthGuard } from '../../../auth/auth.guard';
import { Roles } from '../../../auth/roles.decorator';
import { RolService } from '../services/rol.service';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';

@Controller('rol')
@UseGuards(AuthGuard)
export class RolController {
  private readonly logger = new Logger(RolController.name);
  constructor(private readonly service: RolService) { }

  private readonly ENTITY_NAME = 'Rol';

  @Post()
  @Roles('Administrador')
  // Solo los administradores pueden acceder
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() createDto: CreateRolDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;
    this.logger.log(`Obteniendo elementos: skip=${skip}, take=${take}`);
    return this.service.findAll(skip, take);
  }

  @Get(':id')
  @Roles('Administrador', 'Empleado', 'Root')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findOne(+id);
  }

  @Get('search')
  @Roles('Administrador', 'Empleado')
  findByDenominacionFiltered(@Query() paginationDto: PaginationWithDenominacionDto,) {
    const { denominacion='', skip, take } = paginationDto;
    this.logger.log(`Buscando usuarios con denominación: ${denominacion}`);
    return this.service.findByDenominacionFiltered(denominacion, skip, take,);
  }

  @Put(':id')
  @Roles('Administrador')  // Solo los administradores pueden acceder
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRolDto,) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Administrador')  // Solo los administradores pueden acceder
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn(`Eliminando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.remove(id);
  }


}
