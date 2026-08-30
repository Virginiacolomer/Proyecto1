import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

export abstract class BasePersistenceAdapter<T extends ObjectLiteral> {
  protected abstract readonly ALIAS: string;
  protected readonly repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }


  protected baseQuery(incluirEliminados = false): SelectQueryBuilder<T> {
    const query = this.repository.createQueryBuilder(this.ALIAS);

    incluirEliminados
      ? query.withDeleted()
      : query.where(`${this.ALIAS}.deletedAt IS NULL`);

    return query;
  }

  protected baseQueryWithDeleted(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(this.ALIAS).withDeleted();
  }
}
