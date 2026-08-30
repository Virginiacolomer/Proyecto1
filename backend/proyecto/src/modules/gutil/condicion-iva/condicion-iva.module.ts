import { forwardRef, Module } from '@nestjs/common';
import { CondicionIvaService } from './application/services/condicion-iva.service';
import { CondicionIvaController } from './application/controllers/condicion-iva.controller';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { CondicionIVARepository } from './infraestructure/repositories/condicion-iva.repository';
import { CondicionIvaPersistenceAdapter } from './infraestructure/repositories/condicion-iva.persistence-adapters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { CondicionIva } from './domain/entities/condicion-iva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CondicionIva]),

  ],
  controllers: [CondicionIvaController],
  providers: [
    CondicionIvaService,
    {
      provide: 'ICondicionIvaRepository',
      useClass: CondicionIVARepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
    CondicionIvaPersistenceAdapter,
  ],
  exports: [TypeOrmModule, CondicionIvaService],
})
export class CondicionIvaModule {}
