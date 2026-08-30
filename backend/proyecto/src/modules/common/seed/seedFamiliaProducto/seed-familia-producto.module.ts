import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linea } from 'src/modules/gestion-productos/linea/domain/entities/linea.entity';
import { Marca } from 'src/modules/gestion-productos/marca/domain/entities/marca.entity';

import { SeedFamiliaProductoService } from './seed-familia-producto.service';
import { SeedFamiliaProductoController } from './seed-familia-producto.controller';
import { Producto } from 'src/modules/gestion-productos/producto/domain/entities/producto.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ 
      Linea, 
      Marca,
      Producto,
      Usuario,
      Proveedor,

    
    ]), // Repositorios que se inyectarán
  ],
  controllers: [SeedFamiliaProductoController], // Agregar el controlador aquí
  providers: [SeedFamiliaProductoService], // Servicio disponible en el módulo
  exports: [SeedFamiliaProductoService], // Exportar si lo usas en otros módulos
})
export class SeedFamiliaProductoModule {}