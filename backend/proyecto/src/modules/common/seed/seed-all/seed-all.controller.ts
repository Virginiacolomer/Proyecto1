import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SeedAllService } from './seed-all.service';

@Controller('seed-all')
export class SeedAllController {

  private readonly logger = new Logger(SeedAllController.name);

  constructor(private readonly seedService: SeedAllService) {}

  @Get('execute')
  executeSeed() {
    this.logger.log('🔄 Ejecutando todos los seeds...');
    return this.seedService.runAllSeeds();
  }
}
