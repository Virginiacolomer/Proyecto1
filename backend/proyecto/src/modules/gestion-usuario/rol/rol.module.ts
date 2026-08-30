import { Module } from '@nestjs/common';
import { RolController } from './application/controllers/rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { RolPersistenceAdapter } from './infraestructure/repositories/rol-persistence-adapters';
import { Rol } from './domain/entities/rol.entity';
import { RolService } from './application/services/rol.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolController],
  providers: [RolService,
    {
      provide: 'IRolRepository',
      useClass: RolPersistenceAdapter
    },
    NormalizeDenominacionPipe,
    RolPersistenceAdapter,
  ],
  exports: [
    TypeOrmModule,
    RolService,
    { provide: 'IRolRepository', useClass: RolPersistenceAdapter },],
})
export class RolModule { }