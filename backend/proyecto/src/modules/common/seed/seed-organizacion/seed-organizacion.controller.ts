import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SeedOrganizacionService } from './seed-organizacion.service';


@Controller('seed-organizacion')
export class SeedOrganizacionController {
   constructor(private readonly seedService: SeedOrganizacionService) { }
 
   private readonly logger = new Logger(SeedOrganizacionController.name);
 
   @Get('execute')
   executeSeed() {
     this.logger.log('Creando una nseed...');
     return this.seedService.runAllSeeds();
 
   }
 
}
