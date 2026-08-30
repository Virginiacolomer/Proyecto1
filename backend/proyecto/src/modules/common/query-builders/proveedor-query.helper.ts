import { SelectQueryBuilder } from 'typeorm';

export class ProveedorQueryHelper {

  static joinProveedor(qb: SelectQueryBuilder<any>, alias = 'op') {
    qb
      .leftJoinAndSelect(`${alias}.proveedor`, 'proveedor')

    return qb;
  }

}