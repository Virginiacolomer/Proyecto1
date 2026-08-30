import { Module } from '@nestjs/common';

import { AlicuotaIvaController } from './application/controllers/alicuota-iva.controller';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlicuotaIva } from './domain/entities/alicuota-iva.entity';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works';
import { AlicuotaIvaPersistenceAdapter } from './infraestructure/repositories/alicuota-iva.persistence-adapters';
import { AlicuotaIvaService } from './application/services/alicuota-iva.service';

@Module({
imports: [
    TypeOrmModule.forFeature([AlicuotaIva]),
    UsuarioModule,
  ],
  controllers: [AlicuotaIvaController],
  providers: [
    AlicuotaIvaService,
    NormalizeDenominacionPipe,
    AlicuotaIvaPersistenceAdapter,

    {
      provide: 'IAlicuotaIvaRepository',
      useClass: AlicuotaIvaPersistenceAdapter,
    },

    {
      provide: 'UnitOfWork',
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [TypeOrmModule, AlicuotaIvaService],
})
export class AlicuotaIvaModule {}
