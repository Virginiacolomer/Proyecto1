import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { CreateProveedorDto } from '../../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../../dto/update-proveedor.dto';
import { IProveedorRepository } from '../../domain/interfaces/proveedor.interface';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { DomicilioService } from 'src/modules/gutil/domicilio/domicilio.service';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Domicilio } from 'src/modules/gutil/domicilio/entities/domicilio.entity';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
import { Proveedor } from '../../domain/entities/proveedor.entity';
import { handleDatabaseError } from 'src/modules/common/query-builders/database-error.helper';

@Injectable()
export class ProveedorPersistenceAdapter implements IProveedorRepository {
  [x: string]: any;
  private readonly logger = new Logger(ProveedorPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Proveedor';

  constructor(
    @InjectRepository(Proveedor)
    private readonly repository: Repository<Proveedor>,
    private domicilioService: DomicilioService,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) {}

  @Transactional()
  async create(
    data: CreateProveedorDto,
    condicionIva: CondicionIva,
    ciudad: Localidad,
    usuario: Usuario,
  ): Promise<Proveedor> {
    const repo = this.uow.getRepository(Proveedor);

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

      usuarioCreated: usuario,
    });
 
    let entityGuardada = await repo.save(nuevaEntity);

    return entityGuardada;
  }


  async findOne(id: number): Promise<Proveedor | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('proveedor')
        .leftJoinAndSelect('proveedor.condicionIva', 'condicionIva')
        .leftJoinAndSelect('proveedor.domicilio', 'domicilio')
        .leftJoinAndSelect('domicilio.localidad', 'localidad')
        .leftJoinAndSelect('localidad.provincia', 'provincia')
        .where('proveedor.id = :id', { id })
        .andWhere('proveedor.deletedAt IS NULL')
        .getOne();

      this.logger.warn(`: ${entity}.`);
      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada');
      }
      return entity;
    } catch (error) {
      handleDatabaseError(this.logger, 'findOne', error);
    }
  }

  async findByDenominacion(denominacion: string): Promise<Proveedor | null> {
    try {
      const entity = await this.repository.findOne({
        where: { denominacion, deletedAt: IsNull() },
      });
      return entity;
    } catch (error) {
      handleDatabaseError(this.logger, 'findByDenominacion', error);
    }
  }

  async findByIdConAuditoria(id: number): Promise<Proveedor | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('proveedor')
        .leftJoinAndSelect('proveedor.usuarioCreated', 'usuarioCreated')
        .leftJoinAndSelect('proveedor.usuarioUpdated', 'usuarioUpdated')
        .leftJoinAndSelect('proveedor.usuarioDeleted', 'usuarioDeleted')
        .where('proveedor.id = :id', { id })

        .getOne();

      this.logger.warn(`: ${entity}.`);
      if (!entity) {
        throw new EntityNotFoundException('Entidad no encontrada.');
      }
      return entity;
    } catch (error) {
      handleDatabaseError(this.logger, 'findByIdConAuditoria', error);
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
  ): Promise<{ data: Proveedor[]; total: number }> {
    try {
      const query = this.repository
        .createQueryBuilder('proveedor')
        .leftJoinAndSelect('proveedor.condicionIva', 'condicionIva')
        .leftJoinAndSelect('proveedor.domicilio', 'domicilio')
        .where('UPPER(proveedor.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .andWhere('proveedor.deletedAt IS NULL');

      if (condicionIvaId && condicionIvaId > 0) {
        query.andWhere('proveedor.condicion_iva_id = :condicionIvaId', {
          condicionIvaId,
        });
      }

      // if (empresaId && empresaId > 0) {
      //   if (empresaId === 1) {
      //     if (conSaldo) {
      //       query.andWhere('cuenta.saldo > 0');
      //     }
      //   }

      //   if (empresaId === 2) {
      //     if (conSaldo) {
      //       query.andWhere('cuentaRespaldo.saldo > 0');
      //     }
      //   }
      // }
      const [data, total] = await query
        .orderBy('proveedor.denominacion', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();
      return { data, total };
    } catch (error) {
      handleDatabaseError(this.logger, 'findBy', error);
    }
  }

  async findAllByDenominacion(denominacion: string): Promise<Proveedor[]> {
    try {
      return await this.repository
        .createQueryBuilder('proveedor')
        .leftJoinAndSelect('proveedor.condicionIva', 'condicionIva')
        .leftJoinAndSelect('proveedor.domicilio', 'domicilio')
        .where('UPPER(proveedor.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .andWhere('proveedor.deletedAt IS NULL')
        .orderBy('proveedor.denominacion', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error al ejecutar el query:', error);
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllByTipo(
    denominacion: string,
    compra: boolean,
    gasto: boolean,
  ): Promise<Proveedor[]> {
    try {
      console.log('denominacion:', denominacion);
      console.log('compra:', compra);
      console.log('gasto:', gasto);
      const query = this.repository
        .createQueryBuilder('proveedor')
        .leftJoinAndSelect('proveedor.condicionIva', 'condicionIva')
        .leftJoinAndSelect('proveedor.domicilio', 'domicilio')
        .where('UPPER(proveedor.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .andWhere('proveedor.deletedAt IS NULL');

      // Casos de combinación de booleanos
      if (compra && gasto) {
        // Ambos true: trae los que son de compra O de gastos (o ambos)
        query.andWhere(
          '(proveedor.esProveedorMateriaPrima = true OR proveedor.esProveedorGastos = true)',
        );
      } else if (compra) {
        // Solo compra
        query.andWhere('proveedor.esProveedorMateriaPrima = true');
      } else if (gasto) {
        // Solo gasto
        query.andWhere('proveedor.esProveedorGastos = true');
      }
      // Si ambos son false → no filtra por tipo, trae todos

      return await query.orderBy('proveedor.denominacion', 'ASC').getMany();
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
    data: UpdateProveedorDto,
    condicionIva: CondicionIva,
    localidad: Localidad,
    usuario: Usuario,
  ): Promise<Proveedor> {
    const repo = this.uow.getRepository(Proveedor);
    const domicilioRepo = this.uow.getRepository(Domicilio);
    try {
      const entity = await this.findOne(id);

      if (!entity) {
        throw new NotFoundException(
          `El proveeodr con ID ${id} no fue encontrado`,
        );
      }

      // Actualizar domicilio si se provee
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

          // 🔥 Guardar explícitamente porque las cascadas no alcanzan
          await domicilioRepo.save(entity.domicilio);
        } else {
          // Crea uno nuevo
          const nuevoDomicilio = domicilioRepo.create({
            direccion: data.domicilio.direccion,
            localidad: localidad, // usa la instancia pasada como parámetro
            usuarioCreatedId: usuario.id,
            usuarioUpdatedId: usuario.id,
          });

          // ⚠️ Primero guardás el domicilio, luego lo asignás al cliente
          const domicilioGuardado = await domicilioRepo.save(nuevoDomicilio);
          entity.domicilio = domicilioGuardado;
        }
      }
      entity.usuarioUpdated = usuario;
      entity.updatedAt = new Date();

      const { domicilio, ...resto } = data;
      Object.assign(entity, resto, { condicionIva });

      const entityActualizada = await repo.save(entity);
      return entityActualizada;
    } catch (error) {
      console.error(error);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  @Transactional() // <-- Importante agregar el decorador de transactr
  async remove(id: number): Promise<Proveedor> {
    const clienteRepo = this.uow.getRepository(Proveedor);
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
        await domicilioRepo.save(entity.domicilio);
      }


      // Marcar el cliente como eliminado
      entity.deletedAt = fechaEliminacion;
      return await clienteRepo.save(entity);
    } catch (error) {
      console.error(error);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async findAllFor(denominacion: string): Promise<Proveedor[]> {
    try {
      return await this.repository
        .createQueryBuilder('proveedor')
        .where('proveedor.deletedAt IS NULL')
        .andWhere('UPPER(proveedor.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .orderBy('proveedor.denominacion', 'ASC')
        .getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllSinSistemaFor(denominacion: string): Promise<Proveedor[]> {
    try {
      return await this.repository
        .createQueryBuilder('proveedor')
        .where('proveedor.deletedAt IS NULL')
        .andWhere('proveedor.sistema = :sistema', { sistema: 0 })
        .andWhere('UPPER(proveedor.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .orderBy('proveedor.denominacion', 'ASC')
        .getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAllSistemaFor(denominacion: string): Promise<Proveedor[]> {
    try {
      return await this.repository
        .createQueryBuilder('proveedor')
        .where('proveedor.deletedAt IS NULL')
        .andWhere('proveedor.sistema = :sistema', { sistema: 1 })
        .andWhere('UPPER(proveedor.denominacion) LIKE :denominacion', {
          denominacion: `%${denominacion.toUpperCase()}%`,
        })
        .orderBy('proveedor.denominacion', 'ASC')
        .getMany();
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByCuit(cuit: string): Promise<Proveedor | null> {
    if (!cuit?.trim()) return null;
    return await this.repository
      .createQueryBuilder('proveedor')
      .where('proveedor.cuit = :cuit', { cuit: cuit.trim() })
      .andWhere('proveedor.deletedAt IS NULL')
      .getOne();
  }

 
}
