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
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { CondicionIvaDto } from 'src/modules/gutil/condicion-iva/dto/condicion-iva.dto';
import { DenominacionEmpresaOperadorDto } from 'src/modules/common/dto/denominacion-empresa-operador.dto';
import { LocalidadDto } from 'src/modules/gutil/localidad/dto/localidad.dto';
import { ProvinciaDto } from 'src/modules/gutil/provincia/dto/provincia.dto';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { OperadorSearchDto } from 'src/modules/gestion-documentos/operador-search.dto';
import { ProveedorService } from '../services/proveedor.service';
import { CreateProveedorDto } from '../../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../../dto/update-proveedor.dto';
import { ProveedorDto } from '../../dto/proveedor.dto';
@ApiTags('Organizacion - Proveedor')
@Controller('proveedor')
@UseGuards(AuthGuard)
export class ProveedorController {
  private readonly logger = new Logger(ProveedorController.name);
  constructor(private readonly service: ProveedorService) {}

  private readonly ENTITY_NAME = 'Proveedor';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  create(@Body() createDto: CreateProveedorDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOperation({
    summary: 'Buscar proveedores por denominación con paginación',
  })
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: DenominacionEmpresaOperadorDto,
  ): Promise<ListadoConTotalDto<OperadorSearchDto>> {
    const {
      empresaId,
      denominacion = '',
      condicionIvaId,
      poseeSaldo,
      skip,
      take,
      incluirEliminados,
    } = paginationDto;
    this.logger.log(`Buscando usuarios con denominación: ${denominacion}`);
    return this.service.findBy(
      empresaId,
      denominacion,
      condicionIvaId,
      poseeSaldo,
      skip,
      take,
      incluirEliminados,
    );
  }

  @Get('find-all-for-condiciones-iva/select')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOperation({ summary: 'Buscar las condiciones de IVA para combo' })
  @ApiResponse({
    status: 200,
    description: 'Listado de condiciones de IVA',
    type: ListadoConTotalDto,
  })
  @ApiTags('Condición IVA')
  findAllCondicionIva(): Promise<ListadoConTotalDto<CondicionIvaDto>> {
    return this.service.findAllCondicionIva();
  }

  @Get('find-all-for-localidades/select')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOperation({ summary: 'Buscar las localidades' })
  @ApiResponse({
    status: 200,
    description: 'Listado de localidades',
    type: ListadoConTotalDto,
  })
  @ApiTags('Localidad')
  findAllLocalidad(): Promise<ListadoConTotalDto<LocalidadDto>> {
    return this.service.findAllLocalidad();
  }

  @Get('find-all-for-localidades-for/:id/select')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOperation({ summary: 'Buscar las localidades dada una provincia' })
  @ApiResponse({
    status: 200,
    description: 'Listado de localidades de una provincia',
    type: ListadoConTotalDto,
  })
  @ApiTags('Localidad')
  findAllLocalidadFor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ListadoConTotalDto<LocalidadDto>> {
    return this.service.findAllLocalidadFor(id);
  }

  @Get('find-all-for-provincias/select')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOperation({ summary: 'Buscar las provincias' })
  @ApiResponse({
    status: 200,
    description: 'Listado de provincias',
    type: ListadoConTotalDto,
  })
  @ApiTags('Provincia')
  findAllProvincia(): Promise<ListadoConTotalDto<ProvinciaDto>> {
    return this.service.findAllProvincia();
  }

  @Get('condicion-iva/:id')
  @Roles('Root', 'Administrador', 'Empleado')
  async geCondicionIvaDelCliente(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarCondicionIvaDesdeCliente(id);
  }

  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOperation({
    summary: 'Obtener proveedor por ID con saldo para una empresa',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'empresaId', type: Number })
  @ApiOkResponse({ type: ProveedorDto })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('empresaId', ParseIntPipe) empresaId: number,
  ): Promise<ProveedorDto> {
    this.logger.log(
      `Buscando ${this.ENTITY_NAME} con ID: ${id} para empresa: ${empresaId}`,
    );
    return this.service.findDtoById(id, empresaId);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  @ApiOperation({ summary: 'Actualizar proveedor por ID' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProveedorDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOperation({ summary: 'Eliminar cliente por ID' })
  @ApiParam({ name: 'id', type: Number })
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
