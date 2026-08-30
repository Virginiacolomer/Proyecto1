import { SelectQueryBuilder } from 'typeorm';

export class DocumentQueryHelper {

  static joinDocumentoBase(qb: SelectQueryBuilder<any>, alias = 'op') {
    qb
      .leftJoinAndSelect(`${alias}.numeroDocumento`, 'numeroDocumento')
      .leftJoinAndSelect(`${alias}.empresa`, 'empresa')
      .leftJoinAndSelect(`${alias}.puntoVenta`, 'puntoVenta');

    return qb;
  }

}