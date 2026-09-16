import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Repository, DataSource } from 'typeorm';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { SuperLinea } from '../../domain/entities/super-linea.entity';
import { ISuperLineaRepository } from '../../domain/interfaces/super-linea.repository.interface';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { Linea } from '../../../linea/domain/entities/linea.entity';

@Injectable()
export class SuperLineaPersistenceAdapter
  extends BasePersistenceAdapter<SuperLinea>
  implements ISuperLineaRepository
{
  private readonly logger = new Logger(SuperLineaPersistenceAdapter.name);

  protected readonly ALIAS = 'super_linea';

  constructor(
    @InjectRepository(SuperLinea)
    repository: Repository<SuperLinea>,

    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(data: CreateSuperLineaDto): Promise<SuperLinea> {
    const repo = this.uow.getRepository(SuperLinea);

    try {
      const nuevaEntity = repo.create({
        denominacion: data.denominacion,
        observacion: data.observacion,
        usuarioCreatedId: data.usuarioCreatedId,
      });

      return await repo.save(nuevaEntity);
    } catch (error) {
      this.logger.error(`Error al conectar con la base de datos: ${error}`);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  @Transactional()
  async update(id: number, data: UpdateSuperLineaDto): Promise<SuperLinea> {
    const repo = this.uow.getRepository(SuperLinea);
    const entity = await repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`SuperLínea con ID ${id} no encontrada`);
    }

    if (data.denominacion !== undefined) entity.denominacion = data.denominacion;
    if (data.observacion !== undefined) entity.observacion = data.observacion;
    if (data.usuarioUpdatedId !== undefined) entity.usuarioUpdatedId = data.usuarioUpdatedId;

    return await repo.save(entity);
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: SuperLinea[]; total: number }> {
    const query = this.repository
      .createQueryBuilder(this.ALIAS)
      .skip(skip)
      .take(take)
      .orderBy(`${this.ALIAS}.denominacion`, 'ASC');

    if (denominacion) {
      query.andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
        denominacion: `%${denominacion.toUpperCase()}%`,
      });
    }

    if (incluirEliminados) {
      query.withDeleted();
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async findAllListado(): Promise<SuperLinea[]> {
    return this.repository.find({
      order: { denominacion: 'ASC' },
    });
  }

  async findOne(id: number): Promise<SuperLinea | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByDenominacion(denominacion: string): Promise<SuperLinea | null> {
    return this.repository.findOne({ where: { denominacion } });
  }

  async findByDenominacionWith(denominacion: string): Promise<SuperLinea | null> {
    return this.repository
      .createQueryBuilder(this.ALIAS)
      .withDeleted()
      .where(`LOWER(${this.ALIAS}.denominacion) = LOWER(:denominacion)`, { denominacion })
      .getOne();
  }

  @Transactional()
  async remove(data: SuperLinea, usuario: Usuario): Promise<SuperLinea> {
    const repo = this.uow.getRepository(SuperLinea);
    data.usuarioDeletedId = usuario.id;
    await repo.save(data);
    return await repo.softRemove(data);
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    const entity = await this.repository
      .createQueryBuilder(this.ALIAS)
      .withDeleted()
      .where(`${this.ALIAS}.id = :id`, { id })
      .getOne();

    if (!entity) return null;

    return {
      id: entity.id,
      detalle: `superlínea ${entity.denominacion}`,
      usuarioCreated: entity.usuarioCreatedId ? String(entity.usuarioCreatedId) : 'Desconocido',
      createdAt: entity.createdAt ? FechaUtils.formatFechaHora(entity.createdAt) : '',
      usuarioUpdated: entity.usuarioUpdatedId ? String(entity.usuarioUpdatedId) : '',
      updatedAt: entity.updatedAt ? FechaUtils.formatFechaHora(entity.updatedAt) : '',
      usuarioDeleted: entity.usuarioDeletedId ? String(entity.usuarioDeletedId) : '',
      deletedAt: entity.deletedAt ? FechaUtils.formatFechaHora(entity.deletedAt) : '',
    };
  }

  async existsLineasActivasBySuperLinea(superLineaId: number): Promise<boolean> {
    const count = await this.dataSource
      .getRepository(Linea)
      .count({
        where: { superLineaId },
      });
    return count > 0;
  }
}
