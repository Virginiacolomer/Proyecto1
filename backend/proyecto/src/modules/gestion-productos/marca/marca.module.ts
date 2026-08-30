import { forwardRef, Module } from '@nestjs/common';
import { MarcaController } from './application/controllers/marca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './domain/entities/marca.entity';
import { MarcaPersistenceAdapter } from './infraestructure/repositories/marca.persistence-adapters';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { MarcaRepository } from './infraestructure/repositories/marca.repository';
import { DataSource } from 'typeorm';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { MarcaService } from './application/services/marca.service';
import { PoliticaEliminacionMarca } from './domain/services/politica-eliminacion-marca.service';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Marca]),
    UsuarioModule,
    forwardRef(() => ProductoModule),

  ],
  controllers: [MarcaController],
  providers: [
    MarcaService,
    NormalizeDenominacionPipe,
    MarcaPersistenceAdapter,
    PoliticaEliminacionMarca,
    {
      provide: 'IMarcaRepository',
      useClass: MarcaRepository,
    },

    {
      provide: 'UnitOfWork',
      useFactory: (dataSource: DataSource): IUnitOfWork => {
        return new TypeOrmUnitOfWork(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [TypeOrmModule, MarcaService],
})
export class MarcaModule {}
