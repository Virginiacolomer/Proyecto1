import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductoOperacionService } from './producto-operacion.service';
import { CreateProductoOperacionDto } from './dto/create-producto-operacion.dto';
import { UpdateProductoOperacionDto } from './dto/update-producto-operacion.dto';

@Controller('producto-operacion')
export class ProductoOperacionController {
  constructor(private readonly productoOperacionService: ProductoOperacionService) {}

  @Post()
  create(@Body() createProductoOperacionDto: CreateProductoOperacionDto) {
    return this.productoOperacionService.create(createProductoOperacionDto);
  }

  @Get()
  findAll() {
    return this.productoOperacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoOperacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoOperacionDto: UpdateProductoOperacionDto) {
    return this.productoOperacionService.update(+id, updateProductoOperacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoOperacionService.remove(+id);
  }
}
