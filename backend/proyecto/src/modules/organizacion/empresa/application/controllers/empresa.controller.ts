import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, Put, Query, UsePipes, UseGuards } from '@nestjs/common';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { PaginationDto } from 'src/modules/common/dto/pagination.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { EmpresaService } from '../services/empresa.service';
import { UpdateEmpresaDto } from '../../dto/update-empresa.dto';
import { CreateEmpresaDto } from '../../dto/create-empresa.dto';

@ApiTags('Organizacion')
@Controller('empresa')
@UseGuards(AuthGuard)
export class EmpresaController {
   private readonly logger = new Logger(EmpresaController.name);
   constructor(private readonly service: EmpresaService) {}
  
   private readonly ENTITY_NAME = 'Empresa';
 
   @Post()
   @Roles('Administrador') 
   @UsePipes(NormalizeDenominacionPipe)
   create(@Body() createDto: CreateEmpresaDto) {
     this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
     return this.service.create(createDto);
   }
 
   @Get()
   findAll(@Query() paginationDto: PaginationDto) {
     const { skip, take } = paginationDto;
     this.logger.log(`Obteniendo elementos: skip=${skip}, take=${take}`);
     return this.service.findAll(skip, take);
   }
 
   @Get('search')
   findByDenominacionFiltered(
     @Query() paginationDto: PaginationWithDenominacionDto,
   ) {
     const { denominacion='', skip, take } = paginationDto;
     this.logger.log(`Buscando usuarios con denominación: ${denominacion}`);
     return this.service.findByDenominacionFiltered(
       denominacion,
       skip,
       take,
     );
   }
 
   @Get(':id')
   findOne(@Param('id', ParseIntPipe) id: number) {
     this.logger.log(`Buscando  ${this.ENTITY_NAME} con ID: ${id}`);
     return this.service.findOne(+id);
   }
 
   @Put(':id')
   @UsePipes(NormalizeDenominacionPipe)
   update(
    @Param('id', ParseIntPipe) id: number,
     @Body() updateDto: UpdateEmpresaDto,
   ) {
     this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
     return this.service.update(id, updateDto);
   }
 
   @Delete(':id')
   @UseGuards(AuthGuard)
   @Roles('Administrador') 
   remove(@Param('id', ParseIntPipe) id: number) {
     this.logger.warn(`Eliminando  ${this.ENTITY_NAME} con ID: ${id}`);
     return this.service.remove(id);
   }
}
