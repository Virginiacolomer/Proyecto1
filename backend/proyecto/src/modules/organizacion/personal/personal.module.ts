import { Module } from '@nestjs/common';
import { PersonalService } from './application/services/personal.service';
import { PersonalController } from './application/controllers/personal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { Personal } from './domain/entities/personal.entity';
import { PersonalPersistenceAdapter } from './infraestructure/repositories/personal.persistence-adapters';
import { PersonalRepository } from './infraestructure/repositories/personal.repository';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { TypeOrmUnitOfWork } from 'src/modules/common/unit-of-work/type-orm-unit-of-works1';

@Module({
    imports: [
      TypeOrmModule.forFeature([Personal]),
      UsuarioModule,
    ],
    controllers: [PersonalController],
    providers: [
      PersonalService,
      {
        provide: 'IPersonalRepository',
        useClass: PersonalRepository,
      }, 
      {
        provide: 'UnitOfWork',
        useFactory: (dataSource: DataSource): IUnitOfWork => {
              return new TypeOrmUnitOfWork(dataSource);
         },
            inject: [DataSource],
      },
      NormalizeDenominacionPipe,
      PersonalPersistenceAdapter,
  
    ],
    exports: [
      TypeOrmModule,
      PersonalService
    ],


})
export class PersonalModule {}
