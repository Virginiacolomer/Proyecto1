import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { AuditoriaQueryHelper } from 'src/modules/common/persistence/auditoria-query.helper';
import { DataSource, IsNull, Repository } from 'typeorm';
import { AlicuotaIva } from '../../domain/entities/alicuota-iva.entity';
import { IAlicuotaIvaRepository } from '../../domain/interfaces/alicuota-iva.repository.interface';
import { CreateAlicuotaIvaDto } from '../../dto/create-alicuota-iva.dto';

@Injectable()
export class AlicuotaIvaPersistenceAdapter
  extends BasePersistenceAdapter<AlicuotaIva>
  implements IAlicuotaIvaRepository
{
  protected readonly ALIAS = 'alicuotaIva';

  private readonly logger = new Logger(
    AlicuotaIvaPersistenceAdapter.name,
  );

  constructor(
    @InjectRepository(AlicuotaIva)
    repository: Repository<AlicuotaIva>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(
    data: CreateAlicuotaIvaDto,
  ): Promise<AlicuotaIva> {
    const repo = this.uow.getRepository(AlicuotaIva);
    const entity = repo.create(data);
    return repo.save(entity);
  }

  @Transactional()
  async update(
    id: number,
    data: Partial<AlicuotaIva>,
  ): Promise<AlicuotaIva> {
    const repo = this.uow.getRepository(AlicuotaIva);
    const existente = await repo.findOneBy({ id });

    if (!existente) {
      throw new EntityNotFoundException('AlicuotaIva no encontrada');
    }

    repo.merge(existente, data);
    return repo.save(existente);
  }

  @Transactional()
  async remove(
    entity: AlicuotaIva,
    usuario: Usuario,
  ): Promise<AlicuotaIva> {
    if (entity.deletedAt) {
      throw new NotFoundException('Entidad ya eliminada.');
    }

    const repo = this.uow.getRepository(AlicuotaIva);
    entity.deletedAt = new Date();
    entity.usuarioDeletedId = usuario.id;

    await repo.save(entity);
    return entity;
  }

  /* ======================================================
   * Queries
   * ====================================================== */

  async findAllFor(denominacion: string): Promise<AlicuotaIva[]> {
    try {
      return await this.baseQuery()
        .andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .orderBy(`${this.ALIAS}.denominacion`, 'ASC')
        .getMany();
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllSistemaFor(
    denominacion: string,
  ): Promise<AlicuotaIva[]> {
    try {
      return await this.baseQuery()
        .andWhere(`${this.ALIAS}.sistema = :sistema`, { sistema: 1 })
        .andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .orderBy(`${this.ALIAS}.denominacion`, 'ASC')
        .getMany();
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacion(
    denominacion: string,
  ): Promise<AlicuotaIva | null> {
    try {
      return await this.repository.findOne({
        where: {
          denominacion,
          deletedAt: IsNull(),
        },
      });
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }
  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    try {
      let qb = this.repository.createQueryBuilder(this.ALIAS);

      qb = AuditoriaQueryHelper.applyJoins(qb, this.ALIAS);
      qb = AuditoriaQueryHelper.applySelect(qb, this.ALIAS);

      const raw = await qb.where(`${this.ALIAS}.id = :id`, { id }).getRawOne();

      if (!raw) return null;

      return AuditoriaQueryHelper.mapToDto(
        raw,
        this.ALIAS,
        'Tipo de Movimiento Bancario',
      );
    } catch (error) {
      this.logger.error('ERROR EN findByIdConAuditoria', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllSinSistemaFor(
    denominacion: string,
  ): Promise<AlicuotaIva[]> {
    try {
      return await this.baseQuery()
        .andWhere(`${this.ALIAS}.sistema = :sistema`, { sistema: 0 })
        .andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .orderBy(`${this.ALIAS}.denominacion`, 'ASC')
        .getMany();
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOne(id: number): Promise<AlicuotaIva> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!entity) {
      throw new EntityNotFoundException('Entidad no encontrada');
    }

    return entity;
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: AlicuotaIva[]; total: number }> {
    try {
      const [data, total] = await this.baseQuery()
        .andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .orderBy(`${this.ALIAS}.denominacion`, 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return { data, total };
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacionWith(
    denominacion: string,
  ): Promise<AlicuotaIva | null> {
    try {
      const normalizada = denominacion.trim().toUpperCase();

      return await this.baseQueryWithDeleted()
        .where(`UPPER(${this.ALIAS}.denominacion) = :denominacion`, {
          denominacion: normalizada,
        })
        .getOne();
    } catch (error) {
      this.logger.error(error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async getTipoMovimiento(
    uow: IUnitOfWork,
    id: number,
  ): Promise<AlicuotaIva | null> {
    const repo = uow.getRepository(AlicuotaIva);

    return await repo.findOne({
      where: { id },
      withDeleted: true, // si querés incluir soft delete
    });
  }

  async findAllListado(): Promise<AlicuotaIva[]> {
    try {
      const query = this.repository
        .createQueryBuilder('alicuotaIva')
        .where('alicuotaIva.deletedAt IS NULL');

      return await query
        .orderBy('alicuotaIva.denominacion', 'ASC')
        .getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }
}
