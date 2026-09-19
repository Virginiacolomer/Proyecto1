import { forwardRef, Module } from '@nestjs/common';
import { PresentacionController } from './application/controllers/presentacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presentacion } from './domain/entities/presentacion.entity';
import { PresentacionPersistenceAdapter } from './infraestructure/repositories/presentacion.persistence-adapters';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { PresentacionRepository } from './infraestructure/repositories/presentacion.repository';
import { DataSource } from 'typeorm';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { PresentacionService } from './application/services/presentacion.service';
import { PoliticaEliminacionPresentacion } from './domain/services/politica-eliminacion-presentacion.service';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Presentacion]),
    UsuarioModule,
    forwardRef(() => ProductoModule),

  ],
  controllers: [PresentacionController],
  providers: [
    PresentacionService,
    NormalizeDenominacionPipe,
    PresentacionPersistenceAdapter,
    PoliticaEliminacionPresentacion,
    {
      provide: 'IPresentacionRepository',
      useClass: PresentacionRepository,
    },

    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [TypeOrmModule, PresentacionService],
})
export class PresentacionModule {}
