import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { Repository, DataSource } from 'typeorm';
import { CreateLineaDto } from '../../dto/create-linea.dto';
import { Linea } from '../../domain/entities/linea.entity';
import { ILineaRepository } from '../../domain/interfaces/linea.repository.interface';
import { UpdateLineaDto } from '../../dto/update-linea.dto';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { QueryBuilderHelper } from 'src/modules/common/query-builders/query-builder-helpers';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';

@Injectable()
export class LineaPersistenceAdapter
  extends BasePersistenceAdapter<Linea>
  implements ILineaRepository
{
  private readonly logger = new Logger(LineaPersistenceAdapter.name);

  protected readonly ALIAS = 'linea';

  constructor(
    @InjectRepository(Linea)
    repository: Repository<Linea>,

    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(data: CreateLineaDto): Promise<Linea> {
    const repo = this.uow.getRepository(Linea);

    try {
      // Creamos la entidad sin sublíneas
      const nuevaEntity = repo.create({
        denominacion: data.denominacion,
        utilizaStockMinimo: data.utilizaStockMinimo,
        stockMinimo: data.stockMinimo,
        usuarioCreatedId: data.usuarioCreatedId,
        observacion: data.observacion,
      });

      const entityGuardada = await repo.save(nuevaEntity);


      return entityGuardada;
    } catch (error) {
      this.logger.error(`Error al conectar con la base de datos: ${error}`);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  @Transactional()
  async update(
    id: number,
    data: UpdateLineaDto,
  ): Promise<Linea> {
    const repo = this.uow.getRepository(Linea);

    const entity = await repo.findOne({
      where: { id }
    });

    if (!entity) {
      throw new NotFoundException(`Línea con ID ${id} no encontrada`);
    }

    // Actualizar datos simples
    entity.denominacion = data.denominacion ?? entity.denominacion;
    entity.utilizaStockMinimo = data.utilizaStockMinimo;
    entity.stockMinimo = data.stockMinimo ?? 0;
    entity.usuarioCreatedId = data.usuarioCreatedId;

    // Guardar entidad antes de procesar sublíneas (opcional según lógica de negocio)
    const entityActualizada = await repo.save(entity);

    return entityActualizada;
  }

  async findOne(id: number): Promise<Linea | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('linea')
        .where('linea.id = :id', { id })
        .andWhere('linea.deletedAt IS NULL')
        .getOne();

      this.logger.warn(`Entidad obtenida: ${JSON.stringify(entity)}`);

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

  async findAllListado(): Promise<Linea[]> {
    try {
      const query = this.baseQuery();
      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      return await query.getMany();
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllListado', error);
    }
  }

  async findByDenominacion(denominacion: string): Promise<Linea | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('linea')
        .where('linea.denominacion = :denominacion', { denominacion })
        .andWhere('linea.deletedAt IS NULL')
        .getOne();

      return entity;
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacionWith(denominacion: string): Promise<Linea | null> {
    this.logger.log(
      `🔎 Buscando denominación (incluyendo borradas): ${denominacion}`,
    );
    try {
      const normalizada = denominacion.trim().toUpperCase();

      const entity = await this.repository
        .createQueryBuilder('linea')
        .withDeleted() //
        .where('UPPER(linea.denominacion) = :denominacion', {
          denominacion: normalizada,
        })
        .getOne();

      if (!entity) {
        this.logger.log(
          ` No encontrada línea (ni activa ni eliminada): ${normalizada}`,
        );
        return null;
      }

      this.logger.log(
        `✅ Encontrada línea (puede estar activa o eliminada): ID=${entity.id}, denominación=${entity.denominacion}`,
      );
      return entity;
    } catch (error) {
      handleDatabaseError(this.logger, 'findByDenominacionWith', error);
    }
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: Linea[]; total: number }> {
    try {
      const query = this.baseQuery(incluirEliminados)

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

  async findAllFor(denominacion: string): Promise<Linea[]> {
    try {
      const query = this.baseQuery()
      query.andWhere('UPPER(linea.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });

      QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');
      return await query.getMany();
    } catch (error) {
      handleDatabaseError(this.logger, 'findAllFor', error);
    }

  }

  async findAllSinSistemaFor(denominacion: string): Promise<Linea[]> {
    try {
      const query = this.repository
        .createQueryBuilder('linea')
        .where('linea.deletedAt IS NULL')
        .andWhere('linea.sistema = :sistema', { sistema: 0 });
      if (denominacion && denominacion.trim() !== '') {
        query.andWhere('UPPER(linea.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        });
      }

      return await query.orderBy('linea.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  @Transactional()
  async remove(entity: Linea, usuario: Usuario): Promise<Linea> {
    const repo = this.uow.getRepository(Linea);

    entity.deletedAt = new Date();
    entity.usuarioDeletedId = usuario.id;
    await repo.save(entity);

    return entity;
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    try {
      const raw = await this.repository
        .createQueryBuilder('linea')
        .leftJoin(
          'usuario',
          'usuarioCreated',
          'usuarioCreated.id = linea.usuarioCreatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioUpdated',
          'usuarioUpdated.id = linea.usuarioUpdatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioDeleted',
          'usuarioDeleted.id = linea.usuarioDeletedId',
        )
        .addSelect([
          'linea.id as linea_id',
          'linea.denominacion as linea_denominacion',
          'linea.createdAt as linea_createdAt',
          'linea.updatedAt as linea_updatedAt',
          'linea.deletedAt as linea_deletedAt',
          'usuarioCreated.denominacion as usuarioCreated_nombre',
          'usuarioUpdated.denominacion as usuarioUpdated_nombre',
          'usuarioDeleted.denominacion as usuarioDeleted_nombre',
        ])
        .where('linea.id = :id', { id })
        .getRawOne();

      console.debug('RAW RESULTADO:', raw);

      if (!raw) return null;

      return {
        id: raw.linea_id ?? 0,
        detalle: raw.linea_denominacion
          ? `linea ${raw.linea_denominacion}`
          : 'linea (sin denominación)',
        createdAt: raw.linea_createdAt
          ? FechaUtils.formatFechaHora(raw.linea_createdAt)
          : '',
        updatedAt: raw.linea_updatedAt
          ? FechaUtils.formatFechaHora(raw.linea_updatedAt)
          : '',
        deletedAt: raw.linea_deletedAt
          ? FechaUtils.formatFechaHora(raw.linea_deletedAt)
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
}
