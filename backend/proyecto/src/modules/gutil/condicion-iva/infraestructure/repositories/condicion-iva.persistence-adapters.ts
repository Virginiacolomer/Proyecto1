import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICondicionIvaRepository } from '../../domain/interfaces/condicion-iva.repository.interface';
import { CreateCondicionIvaDto } from '../../dto/create-condicion-iva.dto';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { CondicionIva } from '../../domain/entities/condicion-iva.entity';

@Injectable()
export class CondicionIvaPersistenceAdapter implements ICondicionIvaRepository {
  private readonly logger = new Logger(CondicionIvaPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'CondicionIva';

  constructor(
    @InjectRepository(CondicionIva)
    private readonly repository: Repository<CondicionIva>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {}

  @Transactional()
  async create(data: CreateCondicionIvaDto): Promise<CondicionIva> {
    const repo = this.uow.getRepository(CondicionIva);
    const nueva = repo.create(data);
    return await repo.save(nueva);
  }

  async findAll(skip = 0, take = 10): Promise<CondicionIva[]> {
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

   async findAllListado(): Promise<CondicionIva[]> {
      try {
        const query = this.repository
          .createQueryBuilder('condicionIva')
          .where('condicionIva.deletedAt IS NULL');
  
        return await query.orderBy('condicionIva.denominacion', 'ASC').getMany();
      } catch (error) {
        throw new DatabaseConnectionException(
          'Error al conectar con la base de datos.',
        );
      }
    }

  async findOne(id: number): Promise<CondicionIva | null> {
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

  async findByDenominacion(denominacion: string): Promise<CondicionIva | null> {
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

  async findByDenominacionFiltered(
  denominacion: string,
  skip = 0,
  take = 10,
): Promise<{ data: CondicionIva[]; total: number }> {
  try {
    const query = this.repository
      .createQueryBuilder('condicionIva')
      .where('condicionIva.deletedAt IS NULL');

    if (denominacion) {
      query.andWhere('UPPER(condicionIva.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });
    }

    const [data, total] = await query
      .orderBy('condicionIva.denominacion', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { data, total };
  } catch (error) {
    throw new DatabaseConnectionException(
      'Error al conectar con la base de datos.',
    );
  }
}

  async findAllFor(): Promise<CondicionIva[]> {
    try {
      return await this.repository.find({
        where: { deletedAt: IsNull() },
        order: { denominacion: 'ASC' },
      });
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  @Transactional()
  async update(id: number, data: Partial<CondicionIva>): Promise<CondicionIva> {
    const repo = this.uow.getRepository(CondicionIva);
    const existente = await repo.findOneBy({ id });
    if (!existente) throw new Error('Marca no encontrada');
    repo.merge(existente, data);
    return await repo.save(existente);
  }

  @Transactional()
  async remove(entity: CondicionIva): Promise<CondicionIva> {
    const repo = this.uow.getRepository(CondicionIva);
   
       entity.deletedAt = new Date();
       await repo.save(entity);
   
       return entity;
  }

    async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
      try {
        const raw = await this.repository
          .createQueryBuilder('condicion')
          .leftJoin(
            'usuario',
            'usuarioCreated',
            'usuarioCreated.id = condicion.usuarioCreatedId',
          )
          .leftJoin(
            'usuario',
            'usuarioUpdated',
            'usuarioUpdated.id = condicion.usuarioUpdatedId',
          )
          .leftJoin(
            'usuario',
            'usuarioDeleted',
            'usuarioDeleted.id = condicion.usuarioDeletedId',
          )
          .addSelect([
            'condicion.id as condicion_id',
            'condicion.denominacion as condicion_denominacion',
            'condicion.createdAt as condicion_createdAt',
            'condicion.updatedAt as condicion_updatedAt',
            'condicion.deletedAt as condicion_deletedAt',
            'usuarioCreated.denominacion as usuarioCreated_nombre',
            'usuarioUpdated.denominacion as usuarioUpdated_nombre',
            'usuarioDeleted.denominacion as usuarioDeleted_nombre',
          ])
          .where('condicion.id = :id', { id })
          .getRawOne();
  
        console.debug('RAW RESULTADO:', raw);
  
        if (!raw) return null;
  
        return {
          id: raw.condicion_id ?? 0,
          detalle: raw.condicion_denominacion
            ? `condicion ${raw.condicion_denominacion}`
            : 'condicion (sin denominación)',
          createdAt: raw.condicion_createdAt
            ? FechaUtils.formatFechaHora(raw.condicion_createdAt)
            : '',
          updatedAt: raw.condicion_updatedAt
            ? FechaUtils.formatFechaHora(raw.condicion_updatedAt)
            : '',
          deletedAt: raw.condicion_deletedAt
            ? FechaUtils.formatFechaHora(raw.condicion_deletedAt)
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
