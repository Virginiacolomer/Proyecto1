import { EntityManager, EntityTarget, Repository, ObjectLiteral } from "typeorm";

export interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): Promise<void>;
  getManager(): EntityManager;
  getRepository<T extends ObjectLiteral>(repo: EntityTarget<T>): Repository<T>;
}