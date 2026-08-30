import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { IConfiguracionSistemaRepository } from '../../domain/interfaces/configuracion-sistema.repository.interface';
import { ConfiguracionSistema } from '../../domain/entities/configuracion-sistema.entity';
import { CreateConfiguracionSistemaDto } from '../../dto/create-configuracion-sistema.dto';

@Injectable()
export class ConfiguracionSistemaPersistenceAdapter
  implements IConfiguracionSistemaRepository
{
  private readonly logger = new Logger(
    ConfiguracionSistemaPersistenceAdapter.name,
  );

  private readonly ENTITY_NAME = 'ConfiguracionSistema';

  constructor(
    @InjectRepository(ConfiguracionSistema)
    private readonly repository: Repository<ConfiguracionSistema>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {}

  @Transactional()
  async create(
    data: CreateConfiguracionSistemaDto,
  ): Promise<ConfiguracionSistema> {
    const repo = this.uow.getRepository(ConfiguracionSistema);
    const nueva = repo.create(data);
    return await repo.save(nueva);
  }

  async findOne(id: number): Promise<ConfiguracionSistema | null> {
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

  async findDtoByEmpresaId(
    empresaId: number,
  ): Promise<ConfiguracionSistema | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('config')
        .leftJoinAndSelect('config.empresa', 'empresa')
        .where('empresa.id = :empresaId', { empresaId })
        .andWhere('config.deletedAt IS NULL')
        .getOne();

      this.logger.warn(`Configuración obtenida: ${JSON.stringify(entity)}`);

      if (!entity) {
        throw new EntityNotFoundException(
          'Configuración no encontrada para la empresa',
        );
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

  @Transactional()
  async update(
    id: number,
    data: Partial<ConfiguracionSistema>,
  ): Promise<ConfiguracionSistema> {
    const repo = this.uow.getRepository(ConfiguracionSistema);
    const existente = await repo.findOneBy({ id });
    if (!existente) throw new Error('Marca no encontrada');
    repo.merge(existente, data);
    return await repo.save(existente);
  }

  @Transactional()
  async remove(entity: ConfiguracionSistema): Promise<ConfiguracionSistema> {
    const repo = this.uow.getRepository(ConfiguracionSistema);

    entity.deletedAt = new Date();
    await repo.save(entity);

    return entity;
  }
}
