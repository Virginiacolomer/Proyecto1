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

import { CreateProductoDto } from '../../dto/create-producto.dto';
import { UpdateProductoDto } from '../../dto/update-producto.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import {
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NormalizeCodigoProveedorPipe } from 'src/modules/common/pipes/normalize-codigo-proveedor.pipe';
import { GetProductoDto } from '../../dto/get-producto.dto';
import { SearchProductoPaginationWithDto } from '../../dto/search-producto-pagination-with.dto';
import { ProductoDto } from '../../dto/producto.dto';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { DenominacionBusquedaDto } from 'src/modules/common/dto/denominacion-busqueda.dto';
import { SearchProductoRapidoDto } from '../../dto/search-producto-rapido.dto';
import { ProductoService } from '../services/producto.service';


@ApiTags('Gestion Productos')
@Controller('producto')
@UseGuards(AuthGuard)
export class ProductoController {
  private readonly logger = new Logger(ProductoController.name);
  constructor(private readonly service: ProductoService) {}

  private readonly ENTITY_NAME = 'Producto';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado', 'Repartidor', 'Repositor')
  @UsePipes(NormalizeDenominacionPipe)
  @UsePipes(NormalizeCodigoProveedorPipe)
  create(@Body() createDto: CreateProductoDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }
  
  @Get('find-all-for-marcas/select')
  @Roles(
    'Root',
    'Administrador',
    'Empleado',
    'Repartidor',
    'Repositor',
    'Vendedor',
  )
  @UsePipes(NormalizeDenominacionSearchPipe)
  async findAllMarcasFor(@Query() dto: DenominacionBusquedaDto) {
    const { denominacion = '' } = dto;
    return this.service.findAllForMarcas(denominacion);
  }


  @Get('find-all-for-lineas/select')
  @Roles(
    'Root',
    'Administrador',
    'Empleado',
    'Repartidor',
    'Repositor',
    'Vendedor',
  )
  @UsePipes(NormalizeDenominacionSearchPipe)
  async findAllLineasFor(@Query() dto: DenominacionBusquedaDto) {
    const { denominacion = '' } = dto;
    return this.service.findAllForLineas(denominacion);
  }

  @Get('search-by-rapido')
  @Roles(
    'Root',
    'Administrador',
    'Empleado',
    'Vendedor',
    'Repartidor',
    'Repositor',
  )
  @UsePipes(NormalizeDenominacionSearchPipe)
  async searchRapido(@Query() dto: SearchProductoRapidoDto) {
    const { exacto, codigo, skip, take } = dto;
    return this.service.findByRapido(codigo, exacto, skip, take);
  }

  @Get('search-by')
  @Roles(
    'Root',
    'Administrador',
    'Empleado',
    'Vendedor',
    'Repartidor',
    'Repositor',
  )
  @UsePipes(NormalizeDenominacionSearchPipe)
  async search(@Query() dto: SearchProductoPaginationWithDto) {
    const {
      denominacion = '',
      codProveedorExacto,
      codigoProveedor,
      codigoReferencia,
      marcaId,
      lineaId,
      proveedorId,
      conStock,
      skip,
      take,
    } = dto;
    return this.service.findBy(
      denominacion,
      codigoProveedor,
      codProveedorExacto,
      codigoReferencia,
      marcaId,
      lineaId,
      proveedorId,
      conStock,
      skip,
      take,
    );
  }

  @Get('marca/:id')
  @Roles('Root', 'Administrador', 'Empleado')
  async getMarcaDelProducto(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarMarcaDesdeProducto(id);
  }


  @Get('linea/:id')
  @Roles('Root', 'Administrador', 'Empleado')
  async geLineaDelProducto(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarLineaDesdeProducto(id);
  }

  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({ type: ProductoDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductoDto> {
    this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findDtoById(+id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  @UsePipes(NormalizeCodigoProveedorPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductoDto,
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
