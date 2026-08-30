import { Module } from '@nestjs/common';
import { ProductoOperacionService } from './producto-operacion.service';
import { ProductoOperacionController } from './producto-operacion.controller';

@Module({
  controllers: [ProductoOperacionController],
  providers: [ProductoOperacionService],
})
export class ProductoOperacionModule {}
