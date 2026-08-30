import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Put,
  UseGuards,
  Query,
  Logger,
  UsePipes,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { Roles } from '../../../auth/roles.decorator';
import { Usuario } from '../../domain/entities/usuario.entity';
import { PaginationDto } from 'src/modules/common/dto/pagination.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { UpdateUsuarioDto } from '../../dto/updateUsuario.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { CreateUsuarioDto } from '../../dto/create-usuario.dto';
import { UpdateContrasenaDto } from '../../dto/updateContrasena.dto';
import { SearchUsuarioDto } from '../../dto/search-usuario.dto';

@Controller('usuario')
@UseGuards(AuthGuard)
export class UsuarioController {
  private readonly logger = new Logger(UsuarioController.name);
  constructor(private readonly service: UsuarioService) {}

  private readonly ENTITY_NAME = 'Usuario';

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: SearchUsuarioDto,
  ) {
    const { denominacion = '', skip, take } = paginationDto;
    this.logger.log(
      `Buscando  ${this.ENTITY_NAME} con denominación: ${denominacion}`,
    );
    return this.service.findBy(denominacion, skip, take);
  }

  @Get()
  @Roles(
    'Administrador',
    'Root',
    'Empleado',
    'Vendedor',
    'Cobrador',
    'Repartidor',
    'Repositor',
  ) // Solo los administradores, root y empleados pueden acceder
  findAll(@Query() paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;

    this.logger.log(`Obteniendo elementos: skip=${skip}, take=${take}`);

    return this.service.findAll(skip, take);
  }

  @Get(':id')
  @Roles(
    'Administrador',
    'Root',
    'Empleado',
    'Vendedor',
    'Cobrador',
    'Repartidor',
    'Repositor',
  ) // Solo los administradores, root y empleados pueden acceder
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findOne(+id);
  }

  @Get('search')
  @Roles(
    'Administrador',
    'Root',
    'Empleado',
    'Vendedor',
    'Cobrador',
    'Repartidor',
    'Repositor',
  ) // Solo los administradores, root y empleados pueden acceder
  findByMailFiltered(@Query() paginationDto: PaginationWithDenominacionDto) {
    const { denominacion = '', skip, take } = paginationDto;
    this.logger.log(`Buscando usuarios con mail: ${denominacion}`);
    return this.service.findByMailFiltered(denominacion, skip, take);
  }

 
  @Patch('cambiar-contrasena/:id')
  async cambiarContrasena(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContrasenaDto,
  ) {
    await this.service.updateContrasena(id, dto);
    return { message: 'Contraseña actualizada correctamente' };
  }

  @Put(':id')
  @Roles('Root', 'Administrador') // Solo los administradores pueden acceder
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUsuarioDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.updateDatos(id, updateDto);
  }

  @Delete(':id')
  @Roles('Administrador') // Solo los administradores pueden acceder
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn(`Eliminando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.remove(id);
  }
}
