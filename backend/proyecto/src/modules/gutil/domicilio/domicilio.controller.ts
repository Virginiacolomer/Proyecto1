import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DomicilioService } from './domicilio.service';
import { CreateDomicilioDto } from './dto/create-domicilio.dto';
import { UpdateDomicilioDto } from './dto/update-domicilio.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('GUtil')
@Controller('domicilio')
export class DomicilioController {
  constructor(private readonly domicilioService: DomicilioService) {}

  @Post()
  create(@Body() createDomicilioDto: CreateDomicilioDto) {
  }

  @Get()
  findAll() {
    return this.domicilioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.domicilioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDomicilioDto: UpdateDomicilioDto) {
    return this.domicilioService.update(+id, updateDomicilioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.domicilioService.remove(+id);
  }
}
