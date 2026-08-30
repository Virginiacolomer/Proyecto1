import { Module } from '@nestjs/common';
import { ClienteService } from './application/services/cliente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { ClientePersistenceAdapter } from './infraestructure/repositories/cliente.persistence-adapters';
import { ClienteRepository } from './infraestructure/repositories/cliente.repository';
import { DomicilioModule } from 'src/modules/gutil/domicilio/domicilio.module';
import { LocalidadModule } from 'src/modules/gutil/localidad/localidad.module';
import { CondicionIvaModule } from 'src/modules/gutil/condicion-iva/condicion-iva.module';
import { DataSource } from 'typeorm';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { ProvinciaModule } from 'src/modules/gutil/provincia/provincia.module';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { ClienteValidationHelper } from '../helpers/cliente-validation-helper';
import { CondicionIvaValidationHelper } from 'src/modules/gutil/condicion-iva/helpers/condicion-iva-validation-helper';
import { PersonalModule } from '../personal/personal.module';
import { EmpresaModule } from '../empresa/empresa.module';
import { Cliente } from './domain/entities/cliente.entity';
import { ClienteController } from './application/controllers/cliente.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    CondicionIvaModule,
    LocalidadModule,
    ProvinciaModule,
    DomicilioModule,
    UsuarioModule,
    PersonalModule,
    EmpresaModule,
  ],
  controllers: [ClienteController],
  providers: [
    ClienteService,
    ClienteValidationHelper,
    CondicionIvaValidationHelper,
    {
      provide: 'IClienteRepository',
      useClass: ClienteRepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
    ClientePersistenceAdapter,
  ],
  exports: [TypeOrmModule, ClienteService],
})
export class ClienteModule {}
