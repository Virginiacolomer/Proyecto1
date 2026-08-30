import {
  DataSource,
  EntityManager,
  QueryRunner,
  EntityTarget,
  Repository,
  ObjectLiteral,
} from "typeorm";
import { IUnitOfWork } from "./iunit-of-work.";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeOrmUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner | null = null;

  constructor(private readonly dataSource: DataSource) {}

  async start(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this.queryRunner) return;
    await this.queryRunner.commitTransaction();
  }

  async rollback(): Promise<void> {
    if (!this.queryRunner) return;
    await this.queryRunner.rollbackTransaction();
  }

  async release(): Promise<void> {
    if (!this.queryRunner) return;
    await this.queryRunner.release();
    this.queryRunner = null;
  }

  getManager(): EntityManager {
    if (this.queryRunner) {
      return this.queryRunner.manager;
    }
    return this.dataSource.manager;
  }

  getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Repository<T> {
    if (this.queryRunner) {
      return this.queryRunner.manager.getRepository(entity);
    }
    return this.dataSource.getRepository(entity);
  }
}
