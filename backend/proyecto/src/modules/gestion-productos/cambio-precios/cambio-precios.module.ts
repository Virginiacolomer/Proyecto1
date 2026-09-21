import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialPrecio } from '../producto/domain/entities/historial-precio.entity';
import { CambioPreciosController } from './application/controllers/cambio-precios.controller';
import { CambioPreciosService } from './application/services/cambio-precios.service';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialPrecio]), ProductoModule],
  controllers: [CambioPreciosController],
  providers: [CambioPreciosService],
  exports: [CambioPreciosService],
})
export class CambioPreciosModule {}
