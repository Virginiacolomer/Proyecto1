import { Module } from '@nestjs/common';
import { LocalidadService } from './application/services/localidad.service';
import { LocalidadController } from './application/controllers/localidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { Localidad } from './domain/entities/localidad.entity';
import { LocalidadPersistenceAdapter } from './infraestructure/repositories/localidad.persistence-adapters';
import { ProvinciaModule } from '../provincia/provincia.module';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';

@Module({
  imports: [TypeOrmModule.forFeature([Localidad]), 
  ProvinciaModule,],
  controllers: [LocalidadController],
  providers: [
    LocalidadService,
    {
      provide: 'ILocalidadRepository',
      useClass: LocalidadPersistenceAdapter,
    },

    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
  ],
  exports: [TypeOrmModule, LocalidadService],
})
export class LocalidadModule {}
