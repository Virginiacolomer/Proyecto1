import {
  Controller,
  Logger,
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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

import { CondicionIvaDto } from 'src/modules/gutil/condicion-iva/dto/condicion-iva.dto';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { LocalidadDto } from 'src/modules/gutil/localidad/dto/localidad.dto';
import { ProvinciaDto } from 'src/modules/gutil/provincia/dto/provincia.dto';
import { OperadorDto } from 'src/modules/gestion-documentos/operador.dto';
import { DenominacionEmpresaOperadorDto } from 'src/modules/common/dto/denominacion-empresa-operador.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { OperadorSearchDto } from 'src/modules/gestion-documentos/operador-search.dto';
import { DenominacionDto } from 'src/modules/common/dto/denominacion.dto';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../../dto/create-cliente.dto';
import { PersonalSearchDto } from 'src/modules/organizacion/personal/dto/personal-search.dto';
import { UpdateClienteDto } from '../../dto/update-cliente.dto';
import { DenominacionEmpresaOperadorUsuarioDto } from 'src/modules/common/dto/denominacion-empresa-operador-usuario.dto';

@ApiTags('Organizacion')
@Controller('cliente')
@UseGuards(AuthGuard)
export class ClienteController {
  private readonly logger = new Logger(ClienteController.name);
  constructor(private readonly service: ClienteService) {}

  private readonly ENTITY_NAME = 'Cliente';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
  @UsePipes(NormalizeDenominacionPipe)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  create(@Body() createDto: CreateClienteDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado', 'Vendedor','Cobrador')
  @ApiOperation({ summary: 'Buscar clientes por denominación con paginación' })
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
    return this.service.findByDenominacionFiltered(
      empresaId,
      denominacion,
      condicionIvaId,
      poseeSaldo,
      skip,
      take,
      incluirEliminados,
    );
  }
  
  @Get('search-by-vendedor')
  @Roles('Root', 'Administrador', 'Empleado', 'Vendedor')
  @ApiOperation({ summary: 'Buscar clientes por denominación con paginación' })
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionVendedorFiltered(
    @Query() paginationDto: DenominacionEmpresaOperadorUsuarioDto,
  ): Promise<ListadoConTotalDto<OperadorSearchDto>> {
    const {
      empresaId,
      denominacion = '',
      condicionIvaId,
      skip,
      take,
    } = paginationDto;
    this.logger.log(`Buscando usuarios con denominación: ${denominacion}`);

    return this.service.findByDenominacionFiltered(
      empresaId,
      denominacion,
      condicionIvaId,
      false,
      skip,
      take,
    ); 
  }

  @Get('find-all-for-condiciones-iva/select')
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
  @UsePipes(NormalizeDenominacionSearchPipe)
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

  @Get('find-all-for-vendedores/select')
  @UsePipes(NormalizeDenominacionSearchPipe)
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
  @ApiOperation({
    summary: 'Buscar clientes filtrando por denominación y empresa',
  })
  @ApiQuery({ name: 'empresaId', required: true })
  @ApiQuery({ name: 'denominacion', required: false })
  @ApiResponse({
    status: 200,
    description: 'Listado de vendedores con total',
    type: ListadoConTotalDto,
  })
  findAllByVendedorDenominacion(
    @Query() paginationDto: DenominacionDto,
  ): Promise<ListadoConTotalDto<PersonalSearchDto>> {
    const { denominacion = '' } = paginationDto;
    this.logger.log(`Buscando usuarios con denominación: ${denominacion}`);
    return this.service.findAllByVendedorDenominacion(denominacion);
  }


  @Get('find-all-for-localidades/select')
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
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
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
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
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
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
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
  async geCondicionIvaDelCliente(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarCondicionIvaDesdeCliente(id);
  }

  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
  @ApiOperation({
    summary: 'Obtener cliente por ID con saldo para una empresa',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'empresaId', type: Number })
  @ApiOkResponse({ type: OperadorDto })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('empresaId', ParseIntPipe) empresaId: number,
  ): Promise<OperadorDto> {
    this.logger.log(
      `Buscando ${this.ENTITY_NAME} con ID: ${id} para empresa: ${empresaId}`,
    );
    return this.service.findDtoById(id, empresaId);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
  @UsePipes(NormalizeDenominacionPipe)
  @ApiOperation({ summary: 'Actualizar cliente por ID' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateClienteDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado','Vendedor')
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
