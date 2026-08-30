import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  ILike,
  IsNull,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IEmpresaRepository } from '../../domain/interfaces/empresa.interface';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { CreateEmpresaDto } from '../../dto/create-empresa.dto';
import { UpdateEmpresaDto } from '../../dto/update-empresa.dto';
import { Empresa } from '../../domain/entities/empresa.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';

@Injectable()
export class EmpresaPersistenceAdapter implements IEmpresaRepository {
  private readonly logger = new Logger(EmpresaPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Empresa';

  constructor(
    @InjectRepository(Empresa)
    private readonly repository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    data: CreateEmpresaDto,
    condicionIva: CondicionIva,
  ): Promise<Empresa> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.log(
        `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${condicionIva.denominacion}`,
      );
      const nuevaEntity = queryRunner.manager.create(Empresa, {
        ...data,
        condicionIva,
      });

      const entityGuardada = await queryRunner.manager.save(nuevaEntity);
      await queryRunner.commitTransaction();
      return entityGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error2 al conectar con la base de datos: ${error.code}++ ${error.message}`,
      );

      if (
        error.code === '42P01' ||
        error.code === 'ER_NO_SUCH_TABLE' ||
        error.message.includes('no such table') ||
        error.number === 208
      ) {
        throw new Error(
          'Error: La tabla de la entidad no existe en la base de datos.',
        );
      }

      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(skip = 0, take = 10): Promise<Empresa[]> {
    try {
      return await this.repository.find({
        where: { deletedAt: IsNull() },
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

  async findOne(id: number): Promise<Empresa | null> {
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

   async findOneWithRelations(id: number): Promise<Empresa | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('empresa')
        .leftJoinAndSelect('empresa.condicionIva', 'condicionIva')
        .where('empresa.id = :id', { id })
        .andWhere('empresa.deletedAt IS NULL')
        .getOne();

      this.logger.warn(`Resultado Empresa: ${JSON.stringify(entity)}`);

      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada');
      }

      return entity;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }

      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacion(denominacion: string): Promise<Empresa | null> {
    try {
      const entity = await this.repository.findOne({
        where: { denominacion, deletedAt: IsNull() },
      });
      return entity;
    } catch (error) {
      if (
        error.code === '42P01' ||
        error.code === 'ER_NO_SUCH_TABLE' ||
        error.message.includes('no such table') ||
        error.number === 208
      ) {
        throw new Error(
          'Error:4 La tabla de la entidad no existe en la base de datos.',
        );
      }
      this.logger.error(
        `Error2 al conectar con la base de datos: ${error.code}`,
      );

      throw new DatabaseConnectionException(
        `Error al conectar con la base de datos.1 ${error.code} `,
      );
    }
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<Empresa[]> {
    try {
      return await this.repository.find({
        where: {
          denominacion: ILike(`%${denominacion}%`),
          deletedAt: IsNull(),
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

  async update(
    id: number,
    data: UpdateEmpresaDto,
    condicionIva: CondicionIva,
  ): Promise<Empresa> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entity = await queryRunner.manager.findOne(Empresa, {
        where: { id },
        relations: ['condicionIva'],
      });

      if (!entity) {
        throw new NotFoundException(`EL prodcuto con ID ${id} no encontrada`);
      }

      // 4️⃣ Actualizar
      Object.assign(entity, data, { condicionIva });

      const entityActualizada = await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
      return entityActualizada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<Empresa> {
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
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async empresaExist(empresaId: number): Promise<boolean> {
    const exists = await this.repository.exists({
      where: { id: empresaId },
    });

    if (!exists) {
      // Verificar si existe pero está eliminada (soft delete)
      const existsDeleted = await this.repository.exist({
        where: { id: empresaId },
        withDeleted: true, // ✅ Incluir eliminadas
      });

      if (existsDeleted) {
        throw new BadRequestException(
          `La empresa con ID ${empresaId} está inactiva`,
        );
      } else {
        throw new NotFoundException(`Empresa con ID ${empresaId} no existe`);
      }
    }
    return exists;
  }
}
