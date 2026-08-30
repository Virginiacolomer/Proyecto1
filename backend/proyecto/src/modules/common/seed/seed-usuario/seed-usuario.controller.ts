import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SeedUsuarioService } from './seed-usuario.service';


@Controller('seed-usuario')
export class SeedUsuarioController {
   constructor(private readonly seedService: SeedUsuarioService) { }
 
   private readonly logger = new Logger(SeedUsuarioController.name);
 
   @Get('execute')
   executeSeed() {
     this.logger.log('Creando una nseed...');
     return this.seedService.runAllSeeds();
 
   }
 
}
