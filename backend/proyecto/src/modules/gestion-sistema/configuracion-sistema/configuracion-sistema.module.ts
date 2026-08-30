import { Module } from '@nestjs/common';
import { ConfiguracionSistemaController } from './application/controllers/configuracion-sistema.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionSistema } from './domain/entities/configuracion-sistema.entity';
import { DataSource } from 'typeorm';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { ConfiguracionSistemaService } from './application/services/configuracion-sistema.service';
import { ConfiguracionSistemaRepository } from './infraestructure/repositories/configuracion-sistema.repository';
import { ConfiguracionSistemaPersistenceAdapter } from './infraestructure/repositories/configuracion-sistema-adapters';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionSistema])],
  controllers: [ConfiguracionSistemaController],
  providers: [
    ConfiguracionSistemaService,

    {
      provide: 'IConfiguracionSistemaRepository',
      useClass: ConfiguracionSistemaRepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    ConfiguracionSistemaPersistenceAdapter,
  ],
  exports: [TypeOrmModule, ConfiguracionSistemaService],
})
export class ConfiguracionSistemaModule {}
