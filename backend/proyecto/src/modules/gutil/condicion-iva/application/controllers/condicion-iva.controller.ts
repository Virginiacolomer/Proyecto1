import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Put,
  Query,
  UsePipes,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { CondicionIvaService } from '../services/condicion-iva.service';
import { CreateCondicionIvaDto } from '../../dto/create-condicion-iva.dto';
import { UpdateCondicionIvaDto } from '../../dto/update-condicion-iva.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CondicionIvaDto } from '../../dto/condicion-iva.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { PdfInterceptor } from 'src/modules/common/pipes/pdf-interceptor.pipe';

@ApiTags('GUtil')
@Controller('condicion-iva')
@UseGuards(AuthGuard)
export class CondicionIvaController {
  private readonly logger = new Logger(CondicionIvaController.name);
  constructor(private readonly service: CondicionIvaService) {}

  private readonly ENTITY_NAME = 'Condicion IVA';

  @Post()
  @Roles('Root')
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() createDto: CreateCondicionIvaDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
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
  @ApiOkResponse({ type: CondicionIvaDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CondicionIvaDto> {
    this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findDtoById(id);
  }

  @Put(':id')
  @Roles('Root')
  @UsePipes(NormalizeDenominacionPipe)
  update(@Param('id') id: number, @Body() updateDto: UpdateCondicionIvaDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root')
  remove(@Param('id') id: number) {
    this.logger.warn(`Eliminando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.remove(id);
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
