import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SeedFamiliaProductoService } from './seed-familia-producto.service';

@Controller('seed-familia-producto')
export class SeedFamiliaProductoController {
  constructor(private readonly seedService: SeedFamiliaProductoService) { }

  private readonly logger = new Logger(SeedFamiliaProductoController.name);

  @Get('execute')
  executeSeed() {
    this.logger.log('Creando una nseed...');
    return this.seedService.runAllSeeds();

  }


}
