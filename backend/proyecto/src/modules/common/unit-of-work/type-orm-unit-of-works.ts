import {
  DataSource,
  EntityManager,
  QueryRunner,
  EntityTarget,
  Repository,
  ObjectLiteral,
} from "typeorm";
import { IUnitOfWork } from "./iunit-of-work.";


export class TypeOrmUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner | null = null;  // Permite que queryRunner sea null cuando no esté inicializado

  constructor(private dataSource: DataSource) {}

  async start(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner(); // Crea el QueryRunner cuando empieza la transacción
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('QueryRunner no inicializado. Llamá a start() primero.');
    }
    await this.queryRunner.commitTransaction();
  }

  async rollback(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('QueryRunner no inicializado. Llamá a start() primero.');
    }
    await this.queryRunner.rollbackTransaction();
  }

  // Aquí agregamos la lógica para liberar el queryRunner y ponerlo en null
  async release(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('QueryRunner no inicializado. Llamá a start() primero.');
    }
    await this.queryRunner.release();  // Libera el QueryRunner
    this.queryRunner = null;  // Ahora es válido reasignarlo a null
  }

  getManager(): EntityManager {
    if (!this.queryRunner) {
      throw new Error('QueryRunner no inicializado. Llamá a start() primero.');
    }
    return this.queryRunner.manager;
  }

  getRepository<T extends ObjectLiteral>(repo: EntityTarget<T>): Repository<T> {
    if (!this.queryRunner) {
      throw new Error('QueryRunner no inicializado. Llamá a start() primero.');
    }
    return this.queryRunner.manager.getRepository(repo);
  }
}

