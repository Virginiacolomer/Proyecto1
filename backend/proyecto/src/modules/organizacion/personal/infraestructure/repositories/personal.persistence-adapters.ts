import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPersonalRepository } from '../../domain/interfaces/personal.interface';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { CreatePersonalDto } from '../../dto/create-personal.dto';
import { UpdatePersonalDto } from '../../dto/update-personal.dto';
import { Personal } from '../../domain/entities/personal.entity';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { Domicilio } from 'src/modules/gutil/domicilio/entities/domicilio.entity';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { BasePersistenceAdapter } from 'src/modules/common/persistence/base-persistence.adapter';
import { QueryBuilderHelper } from 'src/modules/common/query-builders/query-builder-helpers';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';

@Injectable()
export class PersonalPersistenceAdapter
  extends BasePersistenceAdapter<Personal>
  implements IPersonalRepository
{
  private readonly logger = new Logger(PersonalPersistenceAdapter.name);
  protected readonly ALIAS = 'personal';
  private readonly ENTITY_NAME = 'Personal';

  constructor(
    @InjectRepository(Personal)
    repository: Repository<Personal>,

    private usuarioService: UsuarioService,

    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {
    super(repository);
  }

  @Transactional()
  async create(data: CreatePersonalDto, usuario: Usuario): Promise<Personal> {
    const repo = this.uow.getRepository(Personal);
    const localidadRepo = this.uow.getRepository(Localidad);

    const localidad = await localidadRepo.findOneByOrFail({ id: 1 });
    const domicilio = new Domicilio();
    if (domicilio) {
      domicilio.createdAt = new Date();
      domicilio.usuarioCreatedId = usuario.id;
      domicilio.localidad = localidad;
    }

    const nuevaEntity = repo.create({
      ...data,
      domicilio: domicilio,
      usuarioCreated: usuario,
    });

    const entityGuardada = await repo.save(nuevaEntity);
    const usuarioGuardado = await this.usuarioService.createUsuarioFor(
      entityGuardada,
      this.uow,
    );
    entityGuardada.usuario = usuarioGuardado;
    await repo.save(entityGuardada);
    return entityGuardada;
  }

  async findAll(skip = 0, take = 10): Promise<Personal[]> {
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

  async findAllFor(denominacion: string): Promise<Personal[]> {
    try {
      const query = this.repository
        .createQueryBuilder('personal')
        .where('personal.deletedAt IS NULL');

      query.andWhere('UPPER(personal.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion}%`,
      });

      return await query.orderBy('personal.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOne(id: number): Promise<Personal | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('personal')
        .where('personal.id = :id', { id })
        .andWhere('personal.deletedAt IS NULL')
        .getOne();

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
  async findAllListado(): Promise<Personal[]> {
    try {
      const query = this.repository
        .createQueryBuilder('personal')
        .where('personal.deletedAt IS NULL');

      return await query.orderBy('personal.denominacion', 'ASC').getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByIdConAuditoria(id: number): Promise<Personal | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('personal')
        .leftJoinAndSelect('personal.usuarioCreated', 'usuarioCreated')
        .leftJoinAndSelect('personal.usuarioUpdated', 'usuarioUpdated')
        .leftJoinAndSelect('personal.usuarioDeleted', 'usuarioDeleted')
        .where('personal.id = :id', { id })

        .getOne();

      this.logger.warn(`: ${entity}.`);
      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada.');
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

  async findByDenominacion(denominacion: string): Promise<Personal | null> {
    try {
      const entity = await this.repository.findOne({
        where: { denominacion, deletedAt: IsNull() },
      });
      return entity;
    } catch (error) {

      throw new DatabaseConnectionException(
        `Error al conectar con la base de datos.1 } `,
      );
    }
  }

  async findAllVendedorFor(denominacion: string) {
    try {
      const query = this.repository
        .createQueryBuilder('personal')
        .where('personal.deletedAt IS NULL')
        .andWhere('personal.esVendedor = true')
        .andWhere('UPPER(personal.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        });

      return await query.orderBy('personal.denominacion', 'ASC').getMany();
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
  ): Promise<{ data: Personal[]; total: number }> {
    try {
      let query = this.baseQuery();

      query = QueryBuilderHelper.applyDeletedFilter(query, incluirEliminados);

      if (denominacion) {
        query.andWhere(`UPPER(${this.ALIAS}.denominacion) LIKE :denominacion`, {
          denominacion: `%${denominacion.toUpperCase()}%`,
        });
      }

      query = QueryBuilderHelper.applyOrder(
        query,
        this.ALIAS,
        'denominacion',
        'ASC',
      );
      query = QueryBuilderHelper.applyPagination(query, skip, take);

      const [data, total] = await query.getManyAndCount();

      return { data, total };
    } catch (error) {
      handleDatabaseError(this.logger, 'findBy', error);
    }
  }

  @Transactional()
  async update(
    id: number,
    data: UpdatePersonalDto,
    usuario: Usuario,
  ): Promise<Personal> {
    const personalRepo = this.uow.getRepository(Personal);
    try {
      const entity = await this.findOne(id);
      if (!entity) {
        throw new NotFoundException(
          `El peronsale con ID ${id} no fue encontrado`,
        );
      }

      Object.assign(entity, data, { usuarioUpdatedId: usuario.id });

      const entityActualizada = await personalRepo.save(entity);
      return entityActualizada;
    } catch (error) {
      console.error(error);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async remove(id: number): Promise<Personal> {
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
}
