import { forwardRef, Module } from '@nestjs/common';
import { Linea } from './domain/entities/linea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineaPersistenceAdapter } from './infraestructure/repositories/linea.persistence-adapter';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { LineaRepository } from './infraestructure/repositories/linea.repository';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { LineaController } from './application/controllers/linea.controller';
import { LineaService } from './application/services/linea.service';
import { ProductoModule } from '../producto/producto.module';
import { PoliticaEliminacionLinea } from './domain/services/politica-eliminacion-linea.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Linea]),
    forwardRef(() => ProductoModule),
    UsuarioModule,
  ],
  controllers: [LineaController],
  providers: [
    LineaService,
    PoliticaEliminacionLinea,
    {
      provide: 'ILineaRepository',
      useClass: LineaRepository,
    },

    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
    NormalizeDenominacionPipe,
    LineaPersistenceAdapter,
  ],
  exports: [
    TypeOrmModule,
    LineaService,
    LineaPersistenceAdapter,
    'ILineaRepository',
  ],
})
export class LineaModule {}
