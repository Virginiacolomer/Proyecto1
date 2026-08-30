import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';

@Injectable()
export class UsuarioValidator {
  constructor(private readonly usuarioService: UsuarioService) {}

  async validarUsuarioExiste(id: number) {
    const usuario = await this.usuarioService.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }
}