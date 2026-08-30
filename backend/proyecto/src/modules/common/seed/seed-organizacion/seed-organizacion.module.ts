import { Module } from '@nestjs/common';
import { SeedOrganizacionService } from './seed-organizacion.service';
import { SeedOrganizacionController } from './seed-organizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from 'src/modules/organizacion/empresa/domain/entities/empresa.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Provincia } from 'src/modules/gutil/provincia/domain/entities/provincia.entity';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { ConfiguracionSistema } from 'src/modules/gestion-sistema/configuracion-sistema/domain/entities/configuracion-sistema.entity';

import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';

import { Cliente } from 'src/modules/organizacion/cliente/domain/entities/cliente.entity';
import { RolModule } from 'src/modules/gestion-usuario/rol/rol.module';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';
import { AlicuotaIva } from 'src/modules/gutil/alicuota-iva/domain/entities/alicuota-iva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provincia,
      CondicionIva,
      Localidad,
      Empresa,
      Cliente,
      Proveedor,
      Usuario,
      ConfiguracionSistema,
      Personal,
      AlicuotaIva,
    ]),
    RolModule,
  ],
  controllers: [SeedOrganizacionController],
  providers: [SeedOrganizacionService],
  exports: [SeedOrganizacionService],
})
export class SeedOrganizacionModule { }
