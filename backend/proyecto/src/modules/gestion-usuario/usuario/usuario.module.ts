import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './domain/entities/usuario.entity';
import { UsuarioService } from './application/services/usuario.service';
import { UsuarioPersistenceAdapter } from './infraestructure/repositories/usuario-persistence-adapters';
import { RolModule } from '../rol/rol.module';
import { UsuarioController } from './application/controllers/usuario.controller';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';

@Global() 
@Module({
  imports: [TypeOrmModule.forFeature([Usuario]),
  RolModule
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService,
      {
        provide: 'IUsuarioRepository',
        useClass: UsuarioPersistenceAdapter
      },
      NormalizeDenominacionPipe,
    ],
  exports: [
        TypeOrmModule,
        UsuarioService,
        { provide: 'IUsuarioRepository', useClass: UsuarioPersistenceAdapter },
      ],
})
export class UsuarioModule {}
