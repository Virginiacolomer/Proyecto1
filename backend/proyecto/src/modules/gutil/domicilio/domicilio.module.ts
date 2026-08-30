import { Module } from '@nestjs/common';
import { DomicilioService } from './domicilio.service';
import { DomicilioController } from './domicilio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domicilio } from './entities/domicilio.entity';
import { LocalidadModule } from '../localidad/localidad.module';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { DomicilioPersistenceAdapter } from './domicilio.persistence-adapters';

@Module({
  imports: [TypeOrmModule.forFeature([Domicilio]),
    LocalidadModule,
  ],
  controllers: [DomicilioController],
  providers: [DomicilioService,
    {
      provide: 'IDomicilioRepository',
      useClass: DomicilioPersistenceAdapter
    },
    NormalizeDenominacionPipe,],

  exports: [
    TypeOrmModule,
    DomicilioService,],
})
export class DomicilioModule { }

