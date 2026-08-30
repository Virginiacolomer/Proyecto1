import { forwardRef, Module } from '@nestjs/common';
import { EmpresaService } from './application/services/empresa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { EmpresaRepository } from './infraestructure/repositories/empresa.repository';
import { EmpresaPersistenceAdapter } from './infraestructure/repositories/empresa.persistence-adapters';
import { Empresa } from './domain/entities/empresa.entity';
import { CondicionIvaModule } from 'src/modules/gutil/condicion-iva/condicion-iva.module';
import { EmpresaController } from './application/controllers/empresa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa]),
  forwardRef(() => CondicionIvaModule),
  ],
  controllers: [EmpresaController],

  providers: [
    EmpresaService,

    {
      provide: 'IEmpresaRepository',
      useClass: EmpresaRepository,
    },
    NormalizeDenominacionPipe,
    EmpresaPersistenceAdapter,

  ],
  exports: [
    TypeOrmModule,
    EmpresaService,
  ],
})
export class EmpresaModule { }



