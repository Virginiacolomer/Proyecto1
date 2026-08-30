import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedorOperacionService } from './proveedor-operacion.service';
import { CreateProveedorOperacionDto } from './dto/create-proveedor-operacion.dto';
import { UpdateProveedorOperacionDto } from './dto/update-proveedor-operacion.dto';

@Controller('proveedor-operacion')
export class ProveedorOperacionController {
  constructor(private readonly proveedorOperacionService: ProveedorOperacionService) {}

  @Post()
  create(@Body() createProveedorOperacionDto: CreateProveedorOperacionDto) {
    return this.proveedorOperacionService.create(createProveedorOperacionDto);
  }

  @Get()
  findAll() {
    return this.proveedorOperacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorOperacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorOperacionDto: UpdateProveedorOperacionDto) {
    return this.proveedorOperacionService.update(+id, updateProveedorOperacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorOperacionService.remove(+id);
  }
}
