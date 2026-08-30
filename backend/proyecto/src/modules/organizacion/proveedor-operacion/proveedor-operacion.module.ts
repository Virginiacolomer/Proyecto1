import { Module } from '@nestjs/common';
import { ProveedorOperacionService } from './proveedor-operacion.service';
import { ProveedorOperacionController } from './proveedor-operacion.controller';

@Module({
  controllers: [ProveedorOperacionController],
  providers: [ProveedorOperacionService],
})
export class ProveedorOperacionModule {}
