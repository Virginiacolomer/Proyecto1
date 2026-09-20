import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPresentacionRepository } from '../../domain/interfaces/presentacion.repository.interface';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { Presentacion } from '../../domain/entities/presentacion.entity';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { QueryBuilderHelper } from 'src/modules/common/query-builders/query-builder-helpers';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';

@Injectable()
export class PresentacionPersistenceAdapter
  extends BasePersistenceAdapter<Presentacion>
  implements IPresentacionRepository
{
  private readonly logger = new Logger(PresentacionPersistenceAdapter.name);

  protected readonly ALIAS = 'presentacion';

  constructor(
    @InjectRepository(Presentacion)
    repository: Repository<Presentacion>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(data: CreatePresentacionDto): Promise<Presentacion> {
    const repo = this.uow.getRepository(Presentacion);
    const nueva = repo.create(data);
    return await repo.save(nueva);
  }

  async findAllFor(denominacion: string): Promise<Presentacion[]> {
    try {
      const query = this.baseQuery().andWhere(
        `UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`,
        {
          denominacion: `%${denominacion.toUpperCase()}%`,
        },
      );
      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      return await query.getMany();
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllFor', error);
    }

  }

  async findAllListado(): Promise<Presentacion[]> {
    try {
      const query = this.baseQuery();
      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      return await query.getMany();
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllListado', error);
    }

  }

  async findAllSinSistemaFor(denominacion: string): Promise<Presentacion[]> {
    try {
      const query = this.repository
        .createQueryBuilder('presentacion')

        .where('presentacion.deletedAt IS NULL')
        .andWhere('presentacion.sistema = :sistema', { sistema: 0 });

      query.andWhere('UPPER(presentacion.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });

      return await query.orderBy('presentacion.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllSistemaFor(denominacion: string): Promise<Presentacion[]> {
    try {
      const query = this.repository
        .createQueryBuilder('presentacion')

        .where('presentacion.deletedAt IS NULL')
        .andWhere('presentacion.sistema = :sistema', { sistema: 1 });

      query.andWhere('UPPER(presentacion.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });

      return await query.orderBy('presentacion.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOne(id: number): Promise<Presentacion | null> {
    try {
      const entity = await this.repository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      this.logger.warn(`FindOne : ${JSON.stringify(entity)}.`);
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

  async findByDenominacion(denominacion: string): Promise<Presentacion | null> {
    try {
      const entity = await this.repository.findOne({
        where: { denominacion, deletedAt: IsNull() },
      });
      return entity;
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: Presentacion[]; total: number }> {
    try {
      const query = this.baseQuery(incluirEliminados);

      if (denominacion) {
        query.andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
          denominacion: `%${denominacion.toUpperCase()}%`,
        });
      }

      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');

      QueryBuilderHelper.applyPagination(query, skip, take);

      const [data, total] = await query.getManyAndCount();

      return { data, total };
    } catch (error) {
      handleDatabaseError(this.logger, 'findBy', error);
    }
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    try {
      const raw = await this.repository
        .createQueryBuilder('presentacion')
        .leftJoin(
          'usuario',
          'usuarioCreated',
          'usuarioCreated.id = presentacion.usuarioCreatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioUpdated',
          'usuarioUpdated.id = presentacion.usuarioUpdatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioDeleted',
          'usuarioDeleted.id = presentacion.usuarioDeletedId',
        )
        .addSelect([
          'presentacion.id as presentacion_id',
          'presentacion.denominacion as presentacion_denominacion',
          'presentacion.createdAt as presentacion_createdAt',
          'presentacion.updatedAt as presentacion_updatedAt',
          'presentacion.deletedAt as presentacion_deletedAt',
          'usuarioCreated.denominacion as usuarioCreated_nombre',
          'usuarioUpdated.denominacion as usuarioUpdated_nombre',
          'usuarioDeleted.denominacion as usuarioDeleted_nombre',
        ])
        .where('presentacion.id = :id', { id })
        .getRawOne();

      console.debug('RAW RESULTADO:', raw);

      if (!raw) return null;

      return {
        id: raw.presentacion_id ?? 0,
        detalle: raw.presentacion_denominacion
          ? `Presentacion ${raw.presentacion_denominacion}`
          : 'Presentacion (sin denominación)',
        createdAt: raw.presentacion_createdAt
          ? FechaUtils.formatFechaHora(raw.presentacion_createdAt)
          : '',
        updatedAt: raw.presentacion_updatedAt
          ? FechaUtils.formatFechaHora(raw.presentacion_updatedAt)
          : '',
        deletedAt: raw.presentacion_deletedAt
          ? FechaUtils.formatFechaHora(raw.presentacion_deletedAt)
          : '',
        usuarioCreated: raw.usuarioCreated_nombre ?? '',
        usuarioUpdated: raw.usuarioUpdated_nombre ?? '',
        usuarioDeleted: raw.usuarioDeleted_nombre ?? '',
      };
    } catch (error) {
      console.error('ERROR EN findByIdConAuditoria:', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  @Transactional()
  async update(id: number, data: Partial<Presentacion>): Promise<Presentacion> {
    const repo = this.uow.getRepository(Presentacion);
    const existente = await repo.findOneBy({ id });
    if (!existente) throw new Error('Presentacion no encontrada');
    repo.merge(existente, data);
    return await repo.save(existente);
  }

  @Transactional()
  async remove(entity: Presentacion, usuario: Usuario): Promise<Presentacion> {
    const repo = this.uow.getRepository(Presentacion);
    if (entity.deletedAt) {
      throw new NotFoundException('Entidad ya eliminada.');
    }
    entity.deletedAt = new Date();
    entity.usuarioDeletedId = usuario.id;
    await repo.save(entity);

    return entity;
  }

  async findByDenominacionWith(denominacion: string): Promise<Presentacion | null> {
    // this.logger.log(`🔎 Buscando denominación (incluyendo borradas): ${denominacion}`);
    try {
      const normalizada = denominacion.trim().toUpperCase();

      const entity = await this.repository
        .createQueryBuilder('presentacion')
        .withDeleted() // 👈 permite traer registros eliminados (soft delete)
        .where('UPPER(presentacion.denominacion) = :denominacion', {
          denominacion: normalizada,
        })
        .getOne();

      if (!entity) {
        this.logger.log(
          `⚪ No encontrada presentacion (ni activa ni eliminada): ${normalizada}`,
        );
        return null;
      }

      this.logger.log(
        `✅ Encontrada presentacion (puede estar activa o eliminada): ID=${entity.id}, denominación=${entity.denominacion}`,
      );
      return entity;
    } catch (error) {
      handleDatabaseError(this.logger, 'findByDenominacionWith', error);
    }
  }
}
