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
import { LocalidadService } from '../services/localidad.service';
import { CreateLocalidadDto } from '../../dto/create-localidad.dto';
import { UpdateLocalidadDto } from '../../dto/update-localidad.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { ProvinciaDto } from '../../../provincia/dto/provincia.dto';
import { LocalidadDto } from '../../dto/localidad.dto';
import { SearchLocalidadDto } from '../../dto/search-localidad.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';

@ApiTags('GUtil')
@Controller('localidad')
@UseGuards(AuthGuard)
export class LocalidadController {
  private readonly logger = new Logger(LocalidadController.name);
  constructor(private readonly service: LocalidadService) {}

  private readonly ENTITY_NAME = 'Localidad';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() createDto: CreateLocalidadDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(@Query() paginationDto: SearchLocalidadDto) {
    const {
      denominacion = '',
      provinciaId = 0,
      skip,
      take,
      incluirEliminados,
    } = paginationDto;
    this.logger.log(`Buscando localidades con denominación: ${denominacion}`);
    return this.service.findBy(
      denominacion,
      provinciaId,
      skip,
      take,
      incluirEliminados,
    );
  }
  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({ type: LocalidadDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<LocalidadDto> {
    this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findDtoById(+id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLocalidadDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn(`Eliminando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.remove(id);
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
