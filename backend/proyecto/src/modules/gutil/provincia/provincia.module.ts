import { Module } from '@nestjs/common';
import { ProvinciaController } from './application/controllers/provincia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { ProvinciaPersistenceAdapter } from './infraestructure/repositories/provincia.pesistence-adapter';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { Provincia } from './domain/entities/provincia.entity';
import { ProvinciaService } from './application/services/provincia.service';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia])],
  controllers: [ProvinciaController],
  providers: [
    ProvinciaService,
    {
      provide: 'IProvinciaRepository',
      useClass: ProvinciaPersistenceAdapter,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
    ProvinciaPersistenceAdapter,
  ],
  exports: [TypeOrmModule, ProvinciaService],
})
export class ProvinciaModule {}
