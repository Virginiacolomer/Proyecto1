import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';

export class AuditoriaQueryHelper {
  static applyJoins<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    alias: string,
  ): SelectQueryBuilder<T> {
    return qb
      .leftJoin(
        'usuario',
        'usuarioCreated',
        `usuarioCreated.id = ${alias}.usuarioCreatedId`,
      )
      .leftJoin(
        'usuario',
        'usuarioUpdated',
        `usuarioUpdated.id = ${alias}.usuarioUpdatedId`,
      )
      .leftJoin(
        'usuario',
        'usuarioDeleted',
        `usuarioDeleted.id = ${alias}.usuarioDeletedId`,
      );
  }

  static applySelect<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    alias: string,
  ): SelectQueryBuilder<T> {
    return qb.addSelect([
      `${alias}.id as ${alias}_id`,
      `${alias}.denominacion as ${alias}_denominacion`,
      `${alias}.createdAt as ${alias}_createdAt`,
      `${alias}.updatedAt as ${alias}_updatedAt`,
      `${alias}.deletedAt as ${alias}_deletedAt`,
      'usuarioCreated.denominacion as usuarioCreated_nombre',
      'usuarioUpdated.denominacion as usuarioUpdated_nombre',
      'usuarioDeleted.denominacion as usuarioDeleted_nombre',
    ]);
  }

  static mapToDto(
    raw: any,
    alias: string,
    etiqueta: string,
  ): AuditoriaDto {
    return {
      id: raw[`${alias}_id`] ?? 0,
      detalle: raw[`${alias}_denominacion`]
        ? `${etiqueta} ${raw[`${alias}_denominacion`]}`
        : `${etiqueta} (sin denominación)`,
      createdAt: raw[`${alias}_createdAt`]
        ? FechaUtils.formatFechaHora(raw[`${alias}_createdAt`])
        : '',
      updatedAt: raw[`${alias}_updatedAt`]
        ? FechaUtils.formatFechaHora(raw[`${alias}_updatedAt`])
        : '',
      deletedAt: raw[`${alias}_deletedAt`]
        ? FechaUtils.formatFechaHora(raw[`${alias}_deletedAt`])
        : '',
      usuarioCreated: raw.usuarioCreated_nombre ?? '',
      usuarioUpdated: raw.usuarioUpdated_nombre ?? '',
      usuarioDeleted: raw.usuarioDeleted_nombre ?? '',
    };
  }
}
