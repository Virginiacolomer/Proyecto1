import { Module } from '@nestjs/common';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { UsuarioValidator } from './utils/validation/usuario-validator';

@Module({
  imports: [UsuarioModule,],
  providers: [UsuarioValidator],
  exports: [UsuarioValidator],
})
export class CommonModule {}
