import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IMarcaRepository } from '../../domain/interfaces/marca.repository.interface';
import { CreateMarcaDto } from '../../dto/create-marca.dto';
import { Marca } from '../../domain/entities/marca.entity';
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
export class MarcaPersistenceAdapter
  extends BasePersistenceAdapter<Marca>
  implements IMarcaRepository
{
  private readonly logger = new Logger(MarcaPersistenceAdapter.name);

  protected readonly ALIAS = 'marca';

  constructor(
    @InjectRepository(Marca)
    repository: Repository<Marca>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(data: CreateMarcaDto): Promise<Marca> {
    const repo = this.uow.getRepository(Marca);
    const nueva = repo.create(data);
    return await repo.save(nueva);
  }

  async findAllFor(denominacion: string): Promise<Marca[]> {
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

  async findAllListado(): Promise<Marca[]> {
    try {
      const query = this.baseQuery();
      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      return await query.getMany();
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllListado', error);
    }

  }

  async findAllSinSistemaFor(denominacion: string): Promise<Marca[]> {
    try {
      const query = this.repository
        .createQueryBuilder('marca')

        .where('marca.deletedAt IS NULL')
        .andWhere('marca.sistema = :sistema', { sistema: 0 });

      query.andWhere('UPPER(marca.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });

      return await query.orderBy('marca.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllSistemaFor(denominacion: string): Promise<Marca[]> {
    try {
      const query = this.repository
        .createQueryBuilder('marca')

        .where('marca.deletedAt IS NULL')
        .andWhere('marca.sistema = :sistema', { sistema: 1 });

      query.andWhere('UPPER(marca.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });

      return await query.orderBy('marca.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOne(id: number): Promise<Marca | null> {
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

  async findByDenominacion(denominacion: string): Promise<Marca | null> {
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
  ): Promise<{ data: Marca[]; total: number }> {
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
        .createQueryBuilder('marca')
        .leftJoin(
          'usuario',
          'usuarioCreated',
          'usuarioCreated.id = marca.usuarioCreatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioUpdated',
          'usuarioUpdated.id = marca.usuarioUpdatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioDeleted',
          'usuarioDeleted.id = marca.usuarioDeletedId',
        )
        .addSelect([
          'marca.id as marca_id',
          'marca.denominacion as marca_denominacion',
          'marca.createdAt as marca_createdAt',
          'marca.updatedAt as marca_updatedAt',
          'marca.deletedAt as marca_deletedAt',
          'usuarioCreated.denominacion as usuarioCreated_nombre',
          'usuarioUpdated.denominacion as usuarioUpdated_nombre',
          'usuarioDeleted.denominacion as usuarioDeleted_nombre',
        ])
        .where('marca.id = :id', { id })
        .getRawOne();

      console.debug('RAW RESULTADO:', raw);

      if (!raw) return null;

      return {
        id: raw.marca_id ?? 0,
        detalle: raw.marca_denominacion
          ? `Marca ${raw.marca_denominacion}`
          : 'Marca (sin denominación)',
        createdAt: raw.marca_createdAt
          ? FechaUtils.formatFechaHora(raw.marca_createdAt)
          : '',
        updatedAt: raw.marca_updatedAt
          ? FechaUtils.formatFechaHora(raw.marca_updatedAt)
          : '',
        deletedAt: raw.marca_deletedAt
          ? FechaUtils.formatFechaHora(raw.marca_deletedAt)
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
  async update(id: number, data: Partial<Marca>): Promise<Marca> {
    const repo = this.uow.getRepository(Marca);
    const existente = await repo.findOneBy({ id });
    if (!existente) throw new Error('Marca no encontrada');
    repo.merge(existente, data);
    return await repo.save(existente);
  }

  @Transactional()
  async remove(entity: Marca, usuario: Usuario): Promise<Marca> {
    const repo = this.uow.getRepository(Marca);
    if (entity.deletedAt) {
      throw new NotFoundException('Entidad ya eliminada.');
    }
    entity.deletedAt = new Date();
    entity.usuarioDeletedId = usuario.id;
    await repo.save(entity);

    return entity;
  }

  async findByDenominacionWith(denominacion: string): Promise<Marca | null> {
    // this.logger.log(`🔎 Buscando denominación (incluyendo borradas): ${denominacion}`);
    try {
      const normalizada = denominacion.trim().toUpperCase();

      const entity = await this.repository
        .createQueryBuilder('marca')
        .withDeleted() // 👈 permite traer registros eliminados (soft delete)
        .where('UPPER(marca.denominacion) = :denominacion', {
          denominacion: normalizada,
        })
        .getOne();

      if (!entity) {
        this.logger.log(
          `⚪ No encontrada marca (ni activa ni eliminada): ${normalizada}`,
        );
        return null;
      }

      this.logger.log(
        `✅ Encontrada marca (puede estar activa o eliminada): ID=${entity.id}, denominación=${entity.denominacion}`,
      );
      return entity;
    } catch (error) {
      handleDatabaseError(this.logger, 'findByDenominacionWith', error);
    }
  }
}
