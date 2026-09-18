import { forwardRef, Module } from '@nestjs/common';
import { SuperLinea } from './domain/entities/super-linea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperLineaPersistenceAdapter } from './infraestructure/repositories/super-linea.persistence-adapter';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { SuperLineaRepository } from './infraestructure/repositories/super-linea.repository';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { SuperLineaController } from './application/controllers/super-linea.controller';
import { SuperLineaService } from './application/services/super-linea.service';
import { PoliticaEliminacionSuperLinea } from './domain/services/politica-eliminacion-super-linea.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperLinea]),
    UsuarioModule,
  ],
  controllers: [SuperLineaController],
  providers: [
    SuperLineaService,
    PoliticaEliminacionSuperLinea,
    {
      provide: 'ISuperLineaRepository',
      useClass: SuperLineaRepository,
    },
    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
    SuperLineaPersistenceAdapter,
  ],
  exports: [
    TypeOrmModule,
    SuperLineaService,
    SuperLineaPersistenceAdapter,
    'ISuperLineaRepository',
  ],
})
export class SuperLineaModule {}
