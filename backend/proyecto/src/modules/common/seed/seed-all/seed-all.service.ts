import { Injectable, Logger } from '@nestjs/common';
import { SeedOrganizacionService } from '../seed-organizacion/seed-organizacion.service';
import { SeedFamiliaProductoService } from '../seedFamiliaProducto/seed-familia-producto.service';
import { SeedUsuarioService } from '../seed-usuario/seed-usuario.service';

@Injectable()
export class SeedAllService {
  private readonly logger = new Logger(SeedAllService.name);

  constructor(
    private readonly seedUsuarioService: SeedUsuarioService,
    private readonly seedOrganizacionService: SeedOrganizacionService,
    private readonly seedArticuloService: SeedFamiliaProductoService,
    
  ) {}

  async runAllSeeds() {
    this.logger.log('🚀 Ejecutando todos los seeds...');
  
    try {
      await this.seedUsuarioService.runAllSeeds();
      await this.seedOrganizacionService.runAllSeeds();
      await this.seedArticuloService.runAllSeeds(); 
    
   
    } catch (error) {
      this.logger.error('❌ Error al ejecutar los seeds:', error);
    }
  
    this.logger.log('✅ Todos los seeds han sido ejecutados.');
  }
  
}
