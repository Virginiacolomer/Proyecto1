import { Module } from '@nestjs/common';
import { SeedAllService } from './seed-all.service';
import { SeedAllController } from './seed-all.controller';
import { SeedOrganizacionService } from '../seed-organizacion/seed-organizacion.service';
import { SeedFamiliaProductoService } from '../seedFamiliaProducto/seed-familia-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linea } from 'src/modules/gestion-productos/linea/domain/entities/linea.entity';
import { Marca } from 'src/modules/gestion-productos/marca/domain/entities/marca.entity';
import { Producto } from 'src/modules/gestion-productos/producto/domain/entities/producto.entity';
import { Empresa } from 'src/modules/organizacion/empresa/domain/entities/empresa.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { SeedUsuarioService } from '../seed-usuario/seed-usuario.service';
import { Rol } from 'src/modules/gestion-usuario/rol/domain/entities/rol.entity';
import { Provincia } from 'src/modules/gutil/provincia/domain/entities/provincia.entity';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { ConfiguracionSistema } from 'src/modules/gestion-sistema/configuracion-sistema/domain/entities/configuracion-sistema.entity';

import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';
;
import { Cliente } from 'src/modules/organizacion/cliente/domain/entities/cliente.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';
import { AlicuotaIva } from 'src/modules/gutil/alicuota-iva/domain/entities/alicuota-iva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provincia,
      CondicionIva,
      Localidad, 

      Linea,
      Marca,
      Producto,
      Empresa,
      Cliente,
      Proveedor,
      Usuario,
      Rol,
      ConfiguracionSistema,

      Personal,

      AlicuotaIva,

    ]), // Repositorios que se inyectarán
  ],
  controllers: [SeedAllController],
  providers: [SeedAllService,
    SeedUsuarioService,
    SeedOrganizacionService,
    SeedFamiliaProductoService,

  ],
})
export class SeedAllModule { }
