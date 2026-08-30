import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IClienteRepository } from '../../domain/interfaces/cliente.interface';
import { CreateClienteDto } from '../../dto/create-cliente.dto';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { UpdateClienteDto } from '../../dto/update-cliente.dto';
import { DomicilioService } from 'src/modules/gutil/domicilio/domicilio.service';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { Domicilio } from 'src/modules/gutil/domicilio/entities/domicilio.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Personal } from '../../../personal/domain/entities/personal.entity';
import { Cliente } from '../../domain/entities/cliente.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';

@Injectable()
export class ClientePersistenceAdapter implements IClienteRepository {

  private readonly logger = new Logger(ClientePersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Cliente';

  constructor(
    @InjectRepository(Cliente)
    private readonly repository: Repository<Cliente>,
    private domicilioService: DomicilioService,

    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {}


  @Transactional()
  async create(
    data: CreateClienteDto,
    condicionIva: CondicionIva,
    ciudad: Localidad,
    personal: Personal,
    usuario: Usuario,
  ): Promise<Cliente> {
    try {
      const repo = this.uow.getRepository(Cliente);

      const domicilioGuardado = await this.domicilioService.create(
        this.uow,
        ciudad,
        data.domicilio.direccion,
        data.usuarioCreatedId,
      );


      this.logger.log(
        `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${condicionIva.denominacion}`,
      );
      const nuevaEntity = repo.create({
        ...data,

        condicionIva: condicionIva,
        domicilio: domicilioGuardado,
        personal: personal,
        personalId: personal.id,
        usuarioCreated: usuario,
      });
      const entityGuardada = repo.save(nuevaEntity);

      return entityGuardada;
    } catch (error) {
      handleDatabaseError(this.logger, 'created', error);
    }
  }

  async findOne(id: number): Promise<Cliente | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.condicionIva', 'condicionIva')
        .leftJoinAndSelect('cliente.domicilio', 'domicilio')
        .leftJoinAndSelect('cliente.personal', 'personal')
        .leftJoinAndSelect('domicilio.localidad', 'localidad')
        .leftJoinAndSelect('localidad.provincia', 'provincia')
        .where('cliente.id = :id', { id })
        .andWhere('cliente.deletedAt IS NULL')
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

  async findOneWithRelations(id: number): Promise<Cliente | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.condicionIva', 'condicionIva')
        .leftJoinAndSelect('cliente.domicilio', 'domicilio')
        .leftJoinAndSelect('cliente.personal', 'personal')
        .leftJoinAndSelect('domicilio.localidad', 'localidad')
        .leftJoinAndSelect('localidad.provincia', 'provincia')
        .where('cliente.id = :id', { id })
        .andWhere('cliente.deletedAt IS NULL')
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

  async findByDenominacion(denominacion: string): Promise<Cliente | null> {

      const entity = await this.repository.findOne({
        where: { denominacion, deletedAt: IsNull() },
      });
      return entity;
 
  }

  async findByIdConAuditoria(id: number): Promise<Cliente | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.usuarioCreated', 'usuarioCreated')
        .leftJoinAndSelect('cliente.usuarioUpdated', 'usuarioUpdated')
        .leftJoinAndSelect('cliente.usuarioDeleted', 'usuarioDeleted')
        .where('cliente.id = :id', { id })

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

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<Cliente[]> {
    try {
      return await this.repository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.condicionIva', 'condicionIva')
        .leftJoinAndSelect('cliente.domicilio', 'domicilio')
        .leftJoinAndSelect('cliente.personal', 'personal')
        .where('UPPER(cliente.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion}%`,
        })
        .andWhere('cliente.deletedAt IS NULL')
        .orderBy('cliente.denominacion', 'ASC')
        .skip(skip)
        .take(take)
        .getMany();
    } catch (error) {
      console.error('Error al ejecutar el query:', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findBy(
    denominacion: string,
    condicionIvaId: number,
    incluirEliminados: boolean,
    empresaId?: number,
    conSaldo?: boolean,
    skip = 0,
    take = 10,
  ): Promise<{ data: Cliente[]; total: number }> {
    try {
      const query = this.repository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.condicionIva', 'condicionIva')
        .leftJoinAndSelect('cliente.domicilio', 'domicilio')
        .leftJoinAndSelect('cliente.personal', 'personal')
        .where(
          '(UPPER(cliente.denominacion) LIKE :denominacion OR UPPER(cliente.codigo) = :codigo)',
          {
            denominacion: `%${denominacion.toUpperCase()}%`,
            codigo: denominacion.toUpperCase(),
          },
        )
        .andWhere('cliente.deletedAt IS NULL');

      if (condicionIvaId && condicionIvaId > 0) {
        query.andWhere('cliente.condicion_iva_id = :condicionIvaId', {
          condicionIvaId,
        });
      }
      if (empresaId && empresaId > 0) {
        if (empresaId === 1) {
          if (conSaldo) {
            query.andWhere('cuenta.saldo > 0');
          }
        }

        if (empresaId === 2) {
          if (conSaldo) {
            query.andWhere('cuentaRespaldo.saldo > 0');
          }
        }
      }


      const [data, total] = await query
        .orderBy('cliente.denominacion', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return { data, total };
    } catch (error) {
      console.error('Error al ejecutar el query:', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllByDenominacion(denominacion: string): Promise<Cliente[]> {
    try {
      return await this.repository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.condicionIva', 'condicionIva')
        .leftJoinAndSelect('cliente.domicilio', 'domicilio')
        .leftJoinAndSelect('domicilio.localidad', 'localidad')
        .leftJoinAndSelect('localidad.provincia', 'provincia')
        .leftJoinAndSelect('cliente.personal', 'personal')

        .where(
          '(UPPER(cliente.denominacion) LIKE :denominacion OR UPPER(cliente.codigo) = :codigo)',
          {
            denominacion: `%${denominacion.toUpperCase()}%`,
            codigo: denominacion.toUpperCase(),
          },
        )

        .andWhere('cliente.deletedAt IS NULL')
        .orderBy('cliente.denominacion', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error al ejecutar el query:', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }
  async findAllByDenominacionAndCodigo(
    denominacion: string,
  ): Promise<Cliente[]> {
    try {
      return await this.repository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.condicionIva', 'condicionIva')
        .leftJoinAndSelect('cliente.domicilio', 'domicilio')
        .leftJoinAndSelect('domicilio.localidad', 'localidad')
        .leftJoinAndSelect('localidad.provincia', 'provincia')
        .leftJoinAndSelect('cliente.personal', 'personal')

        .where(
          '(UPPER(cliente.denominacion) LIKE :denominacion OR cliente.codigo = :codigo)',
          {
            denominacion: `%${denominacion.toUpperCase()}%`,
            codigo: denominacion,
          },
        )

        .andWhere('cliente.deletedAt IS NULL')
        .orderBy('cliente.denominacion', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error al ejecutar el query:', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  @Transactional()
  async update(
    id: number,
    data: UpdateClienteDto,
    condicionIva: CondicionIva,
    localidad: Localidad,
    personal: Personal,
    usuario: Usuario,
  ): Promise<Cliente> {
    const clienteRepo = this.uow.getRepository(Cliente);
    const domicilioRepo = this.uow.getRepository(Domicilio);

    try {
      const entity = await this.findOne(id);
      if (!entity) {
        throw new NotFoundException(
          `El cliente con ID ${id} no fue encontrado`,
        );
      }

      if (data.domicilio) {
        if (entity.domicilio) {
          // Actualiza campos del domicilio existente
          if (data.domicilio.direccion !== undefined) {
            entity.domicilio.direccion = data.domicilio.direccion;
          }

          if (data.domicilio.localidadId !== undefined) {
            entity.domicilio.localidad = localidad; // usa la instancia real
          }

          entity.domicilio.usuarioUpdatedId = usuario.id;

          await domicilioRepo.save(entity.domicilio);
        } else {
          // Crea uno nuevo
          const nuevoDomicilio = domicilioRepo.create({
            direccion: data.domicilio.direccion,
            localidad: localidad, // usa la instancia pasada como parámetro
            usuarioCreatedId: usuario.id,
            usuarioUpdatedId: usuario.id,
          });

          const domicilioGuardado = await domicilioRepo.save(nuevoDomicilio);
          entity.domicilio = domicilioGuardado;
        }
      }
      entity.usuarioUpdated = usuario;
      entity.updatedAt = new Date();

      const { domicilio, ...resto } = data;
      Object.assign(entity, resto, { condicionIva, personal });

      const entityActualizada = await clienteRepo.save(entity);
      return entityActualizada;
    } catch (error) {
      console.error(error);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  @Transactional() 
  async remove(id: number, usuario: Usuario): Promise<Cliente> {
    const clienteRepo = this.uow.getRepository(Cliente);
    const domicilioRepo = this.uow.getRepository(Domicilio);
  

    const entity = await this.findOne(id);

    if (!entity) {
      throw new Error(`${this.ENTITY_NAME} con ID ${id} no encontrada`);
    }

    if (entity.deletedAt) {
      throw new NotFoundException('Entidad ya eliminada.');
    }

    try {
      const fechaEliminacion = new Date();

      // Marcar relacionadas como eliminadas si existen
      if (entity.domicilio) {
        entity.domicilio.deletedAt = fechaEliminacion;
        entity.domicilio.usuarioDeletedId = usuario.id;
        await domicilioRepo.save(entity.domicilio);
      }



      // Marcar el cliente como eliminado
      entity.deletedAt = fechaEliminacion;
      entity.usuarioDeleted = usuario;
      return await clienteRepo.save(entity);
    } catch (error) {
      console.error(error);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async findByCuit(cuit: string): Promise<Cliente | null> {
    if (!cuit?.trim()) return null;
    return await this.repository
      .createQueryBuilder('cliente')
      .where('cliente.cuit = :cuit', { cuit: cuit.trim() })
      .andWhere('cliente.deletedAt IS NULL')
      .getOne();
  }

  async findByDni(dni: string): Promise<Cliente | null> {
    if (!dni?.trim()) return null;
    return await this.repository
      .createQueryBuilder('cliente')
      .where('cliente.dni = :dni', { dni: dni.trim() })
      .andWhere('cliente.deletedAt IS NULL')
      .getOne();
  }


}
