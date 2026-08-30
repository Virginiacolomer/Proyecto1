import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DataSource, ILike, IsNull, Not, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseConnectionException } from "src/modules/common/exceptions/database-connection.exception";
import { EntityNotFoundException } from "src/modules/common/exceptions/entity-notFound-exceptions";
import { CreateProvinciaDto } from "../../dto/create-provincia.dto";
import { IProvinciaRepository } from "../../domain/interfaces/provincia.repository.interface";
import { IUnitOfWork } from "src/modules/common/unit-of-work/iunit-of-work.";
import { Transactional } from "src/modules/common/decorators/transactional.decoratos";
import { Provincia } from "../../domain/entities/provincia.entity";

@Injectable()
export class ProvinciaPersistenceAdapter implements IProvinciaRepository {
  private readonly logger = new Logger(ProvinciaPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Provincia';

  constructor(
    @InjectRepository(Provincia)
    private readonly repository: Repository<Provincia>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) { }

   @Transactional()
  async create(data: CreateProvinciaDto): Promise<Provincia> {
     const repo = this.uow.getRepository(Provincia);
       const nueva = repo.create(data);
       return await repo.save(nueva);
  }

  async findAll(skip = 0, take = 10): Promise<Provincia[]> {
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

  async findOne(id: number): Promise<Provincia | null> {
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

  async findByDenominacion(denominacion: string): Promise<Provincia | null> {
    try {
      const entity = await this.repository.findOne({ where: { denominacion, deletedAt: IsNull() } });
      return entity;

    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacionFiltered(denominacion: string, skip = 0, take = 10): Promise<Provincia[]> {
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
 
  async findAllFor(): Promise<Provincia[]> {
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
  async update(id: number, data: Partial<Provincia>): Promise<Provincia> {
        const repo = this.uow.getRepository(Provincia);
        const existente = await repo.findOneBy({ id });
        if (!existente) throw new Error('Marca no encontrada');
        repo.merge(existente, data);
        return await repo.save(existente);
  }

  @Transactional()
  async remove(entity: Provincia): Promise<Provincia> {
       const repo = this.uow.getRepository(Provincia);
   
       entity.deletedAt = new Date();
       await repo.save(entity);
   
       return entity;

  }
}
