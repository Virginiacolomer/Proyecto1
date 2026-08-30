import { Module } from '@nestjs/common';
import { SeedUsuarioService } from './seed-usuario.service';
import { SeedUsuarioController } from './seed-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from 'src/modules/gestion-usuario/rol/domain/entities/rol.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rol,
      Usuario,]), 
  ],
  controllers: [SeedUsuarioController],
  providers: [SeedUsuarioService],
  exports: [SeedUsuarioService],
})
export class SeedUsuarioModule { }
