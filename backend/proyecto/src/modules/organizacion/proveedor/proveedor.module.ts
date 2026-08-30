import { Module } from '@nestjs/common';
import { ProveedorService } from './application/services/proveedor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { ProveedorPersistenceAdapter } from './infraestructure/repositories/proveedor.persistence-adapters';
import { ProveedorRepository } from './infraestructure/repositories/proveedor.repository';
import { LocalidadModule } from 'src/modules/gutil/localidad/localidad.module';
import { DomicilioModule } from 'src/modules/gutil/domicilio/domicilio.module';
import { CondicionIvaModule } from 'src/modules/gutil/condicion-iva/condicion-iva.module';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { ProvinciaModule } from 'src/modules/gutil/provincia/provincia.module';
import { ProveedorValidationHelper } from '../helpers/proveedor-validation-helper';
import { CondicionIvaValidationHelper } from 'src/modules/gutil/condicion-iva/helpers/condicion-iva-validation-helper';
import { ProveedorController } from './application/controllers/proveedor.controller';
import { Proveedor } from './domain/entities/proveedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proveedor]),
    CondicionIvaModule,
    LocalidadModule,
    ProvinciaModule,
    DomicilioModule,
    UsuarioModule,
  ],
  controllers: [ProveedorController],
  providers: [
    ProveedorService,
    ProveedorValidationHelper,
    CondicionIvaValidationHelper,
    {
      provide: 'IProveedorRepository',
      useClass: ProveedorRepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
    ProveedorPersistenceAdapter,
  ],
  exports: [TypeOrmModule, ProveedorService],
})
export class ProveedorModule {}
