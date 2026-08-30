import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClienteOperacionService } from './cliente-operacion.service';
import { CreateClienteOperacionDto } from './dto/create-cliente-operacion.dto';
import { UpdateClienteOperacionDto } from './dto/update-cliente-operacion.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Organizacion')
@Controller('cliente-operacion')
export class ClienteOperacionController {
  constructor(private readonly clienteOperacionService: ClienteOperacionService) {}

  @Post()
  create(@Body() createClienteOperacionDto: CreateClienteOperacionDto) {
    return this.clienteOperacionService.create(createClienteOperacionDto);
  }

  @Get()
  findAll() {
    return this.clienteOperacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clienteOperacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteOperacionDto: UpdateClienteOperacionDto) {
    return this.clienteOperacionService.update(+id, updateClienteOperacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clienteOperacionService.remove(+id);
  }
}
