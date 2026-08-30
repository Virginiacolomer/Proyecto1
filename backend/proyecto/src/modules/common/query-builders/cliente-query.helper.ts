import { SelectQueryBuilder } from 'typeorm';

export class ClienteQueryHelper {

  static joinCliente(qb: SelectQueryBuilder<any>, alias = 'doc') {
    qb
      .leftJoinAndSelect(`${alias}.cliente`, 'cliente')

    return qb;
  }

}