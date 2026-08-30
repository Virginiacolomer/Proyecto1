import { SelectQueryBuilder } from "typeorm";
import { Usuario } from "../../domain/entities/usuario.entity";

export class UsuarioPolicy {
  static excluirUsuariosSistema(qb: SelectQueryBuilder<Usuario>) {
    qb.andWhere('usuario.id != :rootId', { rootId: 1 });
  }
}