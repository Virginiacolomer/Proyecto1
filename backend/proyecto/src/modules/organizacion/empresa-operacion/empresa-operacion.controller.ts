import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpresaOperacionService } from './empresa-operacion.service';
import { CreateEmpresaOperacionDto } from './dto/create-empresa-operacion.dto';
import { UpdateEmpresaOperacionDto } from './dto/update-empresa-operacion.dto';

@Controller('empresa-operacion')
export class EmpresaOperacionController {
  constructor(private readonly empresaOperacionService: EmpresaOperacionService) {}

  @Post()
  create(@Body() createEmpresaOperacionDto: CreateEmpresaOperacionDto) {
    return this.empresaOperacionService.create(createEmpresaOperacionDto);
  }

  @Get()
  findAll() {
    return this.empresaOperacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empresaOperacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpresaOperacionDto: UpdateEmpresaOperacionDto) {
    return this.empresaOperacionService.update(+id, updateEmpresaOperacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empresaOperacionService.remove(+id);
  }
}
