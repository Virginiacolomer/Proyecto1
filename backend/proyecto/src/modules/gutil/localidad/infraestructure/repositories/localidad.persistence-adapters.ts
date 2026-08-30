import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { Repository, IsNull, DataSource } from 'typeorm';
import { CreateLocalidadDto } from '../../dto/create-localidad.dto';
import { Localidad } from '../../domain/entities/localidad.entity';
import { ILocalidadRepository } from '../../domain/interfaces/localidad.repository.interface';
import { UpdateLocalidadDto } from '../../dto/update-localidad.dto';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { Provincia } from 'src/modules/gutil/provincia/domain/entities/provincia.entity';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { QueryBuilderHelper } from 'src/modules/common/query-builders/query-builder-helpers';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';

@Injectable()
export class LocalidadPersistenceAdapter
  extends BasePersistenceAdapter<Localidad>
  implements ILocalidadRepository
{
  private readonly logger = new Logger(LocalidadPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Localidad';
  protected readonly ALIAS = 'localidad';
  constructor(
    @InjectRepository(Localidad)
    repository: Repository<Localidad>,
    private readonly dataSource: DataSource,

    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(
    data: CreateLocalidadDto,
    provincia: Provincia,
  ): Promise<Localidad> {
    const repo = this.uow.getRepository(Localidad);

    try {
      const nueva = repo.create({
        ...data,
        provincia,
      });

      const nuevaGuardada = await repo.save(nueva);

      return nuevaGuardada;
    } catch (error) {
       handleDatabaseError(this.logger, 'create', error);
    }
  }

  async findAllFor(): Promise<Localidad[]> {
    try {
        const query = this.baseQuery()
        .leftJoinAndSelect(`${this.ALIAS}.provincia`, 'provincia')
        
        QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');

        return await query.getMany();

    } catch (error) {
     handleDatabaseError(this.logger, 'findAllFor', error);
    }
  }
  async findAllListado(): Promise<Localidad[]> {
    try {

     const query = this.baseQuery(false);
       QueryBuilderHelper.applyOrder(query, this.ALIAS, 'denominacion', 'ASC');

        return await query.getMany();

    } catch (error) {
     handleDatabaseError(this.logger, 'findAllListado', error);
    }
  }

  async findAllForProvincia(provinciaId: number): Promise<Localidad[]> {
    try {
      return await this.repository.find({
        where: {
          deletedAt: IsNull(),
          provincia: { id: provinciaId },
        },
        relations: ['provincia'],
        order: { denominacion: 'ASC' },
      });
    } catch (error) {
       handleDatabaseError(this.logger, 'findAllForProvincia', error);
    }
  }

  async findOne(id: number): Promise<Localidad | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('localidad')
        .leftJoinAndSelect('localidad.provincia', 'provincia')
        .where('localidad.id = :id', { id })
        .andWhere('localidad.deletedAt IS NULL')
        .getOne();

      this.logger.warn(`: ${entity}.`);

      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada.');
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

  async findByDenominacion(denominacion: string): Promise<Localidad | null> {
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
    provinciaId: number,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: Localidad[]; total: number }> {
    try {
      const query = this.baseQuery(incluirEliminados);
      query.leftJoinAndSelect('localidad.provincia', 'provincia');

      if (denominacion) {
        query.andWhere('UPPER(localidad.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        });
      }

      if (provinciaId && provinciaId > 0) {
        query.andWhere('localidad.provincia_id = :provinciaId', {
          provinciaId,
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

  @Transactional()
  async update(
    id: number,
    data: UpdateLocalidadDto,
    provincia: Provincia,
  ): Promise<Localidad> {
    const localidadRepo = this.uow.getRepository(Localidad);
    this.logger.debug(
      `Datos recibidos para actualizar localidad: id=${id}, data=${JSON.stringify(data)}, provinciaId=${provincia.id}`,
    );

    try {
      const entity = await this.findOne(id);

      if (!entity) {
        throw new NotFoundException(`Localidad con ID ${id} no encontrada`);
      }

      entity.denominacion = data.denominacion ?? entity.denominacion;
      entity.observacion = data.observacion ?? entity.observacion;
      entity.updatedAt = new Date(); // ya lo maneja TypeORM igual

      entity.provincia = provincia;

      const entityActualizada = await localidadRepo.save(entity);

      return entityActualizada;
    } catch (error) {
       handleDatabaseError(this.logger, 'update', error);
    }
  }

  async remove(id: number): Promise<Localidad> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`${this.ENTITY_NAME}  con ID ${id} no encontrada`);
    }

    if (!entity || entity.deletedAt) {
      throw new NotFoundException('Entidad no encontrada o ya eliminada.');
    }

    try {
      await this.repository.update(id, { deletedAt: new Date() });
      return entity as Localidad;
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    try {
      const raw = await this.repository
        .createQueryBuilder('localidad')
        .leftJoin(
          'usuario',
          'usuarioCreated',
          'usuarioCreated.id = localidad.usuarioCreatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioUpdated',
          'usuarioUpdated.id = localidad.usuarioUpdatedId',
        )
        .leftJoin(
          'usuario',
          'usuarioDeleted',
          'usuarioDeleted.id = localidad.usuarioDeletedId',
        )
        .addSelect([
          'localidad.id as localidad_id',
          'localidad.denominacion as localidad_denominacion',
          'localidad.createdAt as localidad_createdAt',
          'localidad.updatedAt as localidad_updatedAt',
          'localidad.deletedAt as localidad_deletedAt',
          'usuarioCreated.denominacion as usuarioCreated_nombre',
          'usuarioUpdated.denominacion as usuarioUpdated_nombre',
          'usuarioDeleted.denominacion as usuarioDeleted_nombre',
        ])
        .where('localidad.id = :id', { id })
        .getRawOne();

      console.debug('RAW RESULTADO:', raw);

      if (!raw) return null;

      return {
        id: raw.localidad_id ?? 0,
        detalle: raw.localidad_denominacion
          ? `localidad ${raw.localidad_denominacion}`
          : 'localidad (sin denominación)',
        createdAt: raw.localidad_createdAt
          ? FechaUtils.formatFechaHora(raw.localidad_createdAt)
          : '',
        updatedAt: raw.localidad_updatedAt
          ? FechaUtils.formatFechaHora(raw.localidad_updatedAt)
          : '',
        deletedAt: raw.localidad_deletedAt
          ? FechaUtils.formatFechaHora(raw.localidad_deletedAt)
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
