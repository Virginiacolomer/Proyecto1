import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseConnectionException } from "src/modules/common/exceptions/database-connection.exception";
import { EntityNotFoundException } from "src/modules/common/exceptions/entity-notFound-exceptions";
import { Repository, IsNull, DataSource, ILike, In } from "typeorm";
import { IRolRepository } from "../../domain/interfaces/rol-repository.interface";
import { CreateRolDto } from "../../dto/create-rol.dto";
import { Rol } from "../../domain/entities/rol.entity";

@Injectable()
export class RolPersistenceAdapter implements IRolRepository {

  private readonly logger = new Logger(RolPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Rol';

  constructor(
    @InjectRepository(Rol)
    private readonly repository: Repository<Rol>,
    private readonly dataSource: DataSource
  ) { }

  async create(data: CreateRolDto): Promise<Rol> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      const nuevaEntity = queryRunner.manager.create(Rol, data);
      const entityGuardada = await queryRunner.manager.save(nuevaEntity);
      await queryRunner.commitTransaction();
      return entityGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`${this.ENTITY_NAME}Error en transacción : ${error.message}`);
      throw new DatabaseConnectionException('Error al guardar en la base de datos.');
    } finally {
      await queryRunner.release();
    }

  }

  async findAll(skip = 0, take = 10): Promise<Rol[]> {
    try {
      return await this.repository.find({
        where: { deletedAt: IsNull() },
        skip,
        take,
        order: { denominacion: 'DESC' },
      });
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOne(id: number): Promise<Rol | null> {
    try {
      const entity = await this.repository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      this.logger.warn(`: ${entity}.`);
      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada');
      }
      return entity;

    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        // Deja pasar la excepción específica
        throw error;
      }

      // Otros errores son considerados como problemas de conexión
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacion(denominacion: string): Promise<Rol | null> {
    try {
      const entity = await this.repository.findOne({ where: { denominacion, deletedAt: IsNull() } });
      return entity;

    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacionFiltered(denominacion: string, skip = 0, take = 10): Promise<Rol[]> {
    try {
      return await this.repository.find({
        where: {
          denominacion: ILike(`%${denominacion}%`),
          deletedAt: IsNull()
        },
        skip,
        take,
        order: { denominacion: 'ASC' },
      });
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async update(id: number, data: Partial<Rol>): Promise<Rol> {
   const queryRunner = this.dataSource.createQueryRunner();
       await queryRunner.connect();
       await queryRunner.startTransaction();
       try {
         const entity = await queryRunner.manager.findOne(Rol, {
           where: { id }
         });
   
         if (!entity) {
           throw new NotFoundException(`${this.ENTITY_NAME}  con ID ${id} no encontrada`);
         }
   
         Object.assign(entity, data);
   
         const entityActualizada = await queryRunner.manager.save(entity);
         await queryRunner.commitTransaction();
         return entityActualizada;
       } catch (error) {
         await queryRunner.rollbackTransaction();
         throw new DatabaseConnectionException('Error al guardar en la base de datos.');
       } finally {
         await queryRunner.release();
       }
  }

  async remove(id: number): Promise<Rol> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`${this.ENTITY_NAME}  con ID ${id} no encontrada`);
    }

    if (entity.deletedAt) {
      throw new NotFoundException('Entidad ya eliminada.');
    }

    try {
      // Marcar como eliminada y guardar los cambios
      entity.deletedAt = new Date();
      return await this.repository.save(entity); // Devuelve la entidad con deletedAt actualizado
    } catch (error) {

      throw new DatabaseConnectionException('Error al guardar en la base de datos.');
    }

  }


  async findByIds(ids: number[]): Promise<Rol[]> {
    return this.repository.findBy({ id: In(ids) });
  }

  
}
