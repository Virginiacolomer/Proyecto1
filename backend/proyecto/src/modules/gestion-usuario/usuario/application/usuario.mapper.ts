import { Logger } from '@nestjs/common';
import { Usuario } from '../domain/entities/usuario.entity';
import { Usuario2Dto } from '../dto/usuario2.dto';

export class UsuarioMapper {
  private static readonly logger = new Logger(UsuarioMapper.name);

  static toDto(entity: Usuario): Usuario2Dto {
    return {
      id: entity.id,
      denominacion: entity.denominacion,

    };
  }
}
