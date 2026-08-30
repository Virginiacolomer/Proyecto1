import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'src/modules/common/decorators/transactional.decoratos';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { EntityNotFoundException } from 'src/modules/common/exceptions/entity-notFound-exceptions';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Linea } from 'src/modules/gestion-productos/linea/domain/entities/linea.entity';
import { Marca } from 'src/modules/gestion-productos/marca/domain/entities/marca.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Repository, IsNull, DataSource } from 'typeorm';
import { Producto } from '../../domain/entities/producto.entity';
import { IProductoRepository } from '../../domain/interfaces/producto.repository-interface';
import { CreateProductoDto } from '../../dto/create-producto.dto';
import { UpdatePrecioDto } from '../../dto/update-precio.dto';
import { UpdateProductoDto } from '../../dto/update-producto.dto';
import { ProductoMapper } from '../../mappers/producto.mapper';


@Injectable()
export class ProductoPersistenceAdapter implements IProductoRepository {
  private readonly logger = new Logger(ProductoPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Producto';

  constructor(
    @InjectRepository(Producto)
    private readonly repository: Repository<Producto>,
    private readonly dataSource: DataSource,
    @Inject('UnitOfWork') public readonly uow: IUnitOfWork,
  ) { }


  @Transactional()
  async create(
    data: CreateProductoDto,
    linea: Linea,
    marca: Marca,
    usuario: Usuario,
  ): Promise<Producto> {
    const repo = this.uow.getRepository(Producto);
    this.logger.log(`Creando un nuevo p ${this.ENTITY_NAME}`);

    try {
      // DEBUG: Loggear todos los datos que llegan
      this.logger.debug('Data recibida:', JSON.stringify(data, null, 2));
      // Verificar que todos los objetos relacionados existan
      this.logger.debug('Linea:', linea);
      this.logger.debug('Marca:', marca);
      this.logger.debug('Usuario:', usuario);

      const nuevaEntity = repo.create({
        ...data,
        linea,
        marca,
        usuarioCreated: usuario,
      });

      this.logger.debug('Entity creada:', nuevaEntity);

      const entityGuardada = await repo.save(nuevaEntity);
      this.logger.log(`Entity guardada con ID: ${entityGuardada.id}`);

      this.logger.log(
        `${this.ENTITY_NAME} creado exitosamente con ID: ${entityGuardada.id}`,
      );


      return entityGuardada;
    } catch (error) {
      this.logger.error(`Error al crear ${this.ENTITY_NAME}:`, error);
      this.logger.error('Stack trace:', error);
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }
  async findOne(id: number): Promise<Producto | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.linea', 'linea')
        .leftJoinAndSelect('producto.marca', 'marca')
        .where('producto.id = :id', { id })
        .andWhere('producto.deletedAt IS NULL')
        .getOne();

      this.logger.warn(`rrr: ${entity}.`);
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

  async findByIdConAuditoria(id: number): Promise<Producto | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.usuarioCreated', 'usuarioCreated')
        .leftJoinAndSelect('producto.usuarioUpdated', 'usuarioUpdated')
        .leftJoinAndSelect('producto.usuarioDeleted', 'usuarioDeleted')
        .where('producto.id = :id', { id })

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

  async findByIdWithoutRelations(id: number): Promise<Producto | null> {
    try {
      const entity = await this.repository
        .createQueryBuilder('producto')
        .where('producto.id = :id', { id })
        .andWhere('producto.deletedAt IS NULL') // Si usás soft delete
        .getOne();

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

  @Transactional()
  async update(
    id: number,
    data: UpdateProductoDto,
    linea: Linea,
    marca: Marca,

    usuario: Usuario,
  ): Promise<Producto> {
    const repo = this.uow.getRepository(Producto);
    try {
      const entity = await this.findOne(id);

      if (!entity) {
        throw new NotFoundException(`EL prodcuto con ID ${id} no encontrada`);
      }
      const {

        ...dataSinItems
      } = data;

      Object.assign(entity, dataSinItems, {
        linea,
        marca,
      });

      entity.usuarioUpdated = usuario; 
      const entityActualizada = await repo.save(entity);


      return entityActualizada;
    } catch (error) {
      this.logger.warn(`Items para eliminar: )}`);

      throw new DatabaseConnectionException(error);
    }
  }


  async updateEntity(uow: IUnitOfWork, producto: Producto): Promise<Producto> {
    const repo = uow.getRepository(Producto);
    return await repo.save(producto);
  }

  async remove(entity: Producto, usuario: Usuario): Promise<Producto> {

    if (entity.deletedAt) {
      throw new NotFoundException('Entidad  ya eliminada.');
    }

    try {
      // Marcar como eliminada y guardar los cambios
      entity.deletedAt = new Date();
      entity.usuarioDeleted = usuario;
      return await this.repository.save(entity);
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async findBy(
    denominacion: string,
    codigoProveedor: string,
    codProveedorExacto: boolean,
    codigoReferencia: string,
    marca_id: number,
    linea_id: number,
    proveedor_id: number,
    conStock: boolean,
    skip: number,
    take: number,
  ): Promise<{ data: Producto[]; total: number }> {
    this.logger.warn(`llega`);
    const query = this.repository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.marca', 'marca')
      .leftJoinAndSelect('producto.linea', 'linea')

    if (denominacion || codigoProveedor || codigoReferencia) {
      const condiciones: string[] = [];
      const parametros: any = {};

      if (denominacion) {
        condiciones.push(
          `UPPER(producto.denominacion) LIKE UPPER(:denominacion)`,
        );
        parametros.denominacion = `%${denominacion}%`;
      }

      if (codigoProveedor) {
        if (codProveedorExacto) {
          condiciones.push(
            `UPPER(producto.codigoProveedor) = UPPER(:codigoProveedor)`,
          );
          parametros.codigoProveedor = codigoProveedor;
        } else {
          condiciones.push(
            `UPPER(producto.codigoProveedor) LIKE UPPER(:codigoProveedor)`,
          );
          parametros.codigoProveedor = `%${codigoProveedor}%`;
        }
      }

      if (codigoReferencia) {
        condiciones.push(
          `UPPER(producto.codigoReferencia) LIKE UPPER(:codigoReferencia)`,
        );
        parametros.codigoReferencia = `%${codigoReferencia}%`;
      }

      query.andWhere(`(${condiciones.join(' OR ')})`, parametros);
    }

    if (marca_id) {
      query.andWhere('marca.id = :marca_id', { marca_id });
    }
    if (linea_id) {
      query.andWhere('linea.id = :linea_id', { linea_id });
    }

    this.logger.warn(`conStock llega como: ${conStock} (${typeof conStock})`);

    if (conStock) {
      query.andWhere('producto.stock > 0');
    }
    query.andWhere('producto.deletedAt IS NULL');
    query.orderBy('producto.denominacion', 'ASC');
    // Paginación
    query.skip(skip).take(take);

    const [data, total] = await query.getManyAndCount();
    this.logger.warn(`conStock llega como 1: ${data}`);
    return {
      data,
      total,
    };
  }

  async findByRapido(
    codigo: string,
    exacto: boolean,
    skip: any,
    take: number,
  ): Promise<{ data: Producto[]; total: number }> {
    this.logger.warn(`llega`);

    const query = this.repository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.marca', 'marca')
      .leftJoinAndSelect('producto.linea', 'linea')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .where('producto.deletedAt IS NULL');


    if (codigo) {
      if (exacto) {
        // Exacto solo en los códigos
        query.andWhere(
          '(producto.codigoProveedor = :codigo OR producto.codigoReferencia = :codigo)',
          { codigo },
        );
      } else {
        // Parcial en códigos Y denominación
        query.andWhere(
          `(
        producto.codigoProveedor LIKE :codigo OR 
        producto.codigoReferencia LIKE :codigo OR 
        producto.denominacion LIKE :codigo
      )`,
          { codigo: `%${codigo}%` },
        );
      }
    }

    query.orderBy('producto.denominacion', 'ASC');
    query.skip(skip).take(take);

    const [data, total] = await query.getManyAndCount();

    this.logger.warn(`Resultados: ${data.length} encontrados`);

    return { data, total };
  }

  async isCodigoProveedorDuplicado(
    codigoProveedor: string | null,
    id?: number,
  ): Promise<boolean> {
    // Si el código es nulo, vacío o '0', no hace falta verificar duplicados
    if (
      !codigoProveedor ||
      codigoProveedor.trim() === '' ||
      codigoProveedor === '0'
    ) {
      return false;
    }

    const query = this.repository
      .createQueryBuilder('producto')
      .where('producto.codigoProveedor = :codigoProveedor', {
        codigoProveedor,
      });

    // Si se está actualizando, excluimos el producto actual
    if (id) {
      query.andWhere('producto.id != :id', { id });
    }

    const existe = await query.getExists();

    return existe; // true si existe otro con el mismo código
  }

  @Transactional()
  async actualizarPrecio(id: number, dto: UpdatePrecioDto, usuario: Usuario) {
    const repo = this.uow.getRepository(Producto);
    const entity = await repo.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException('Producto no encontrado');
    }

    ProductoMapper.mapPrecios(entity, dto, usuario);

    await repo.save(entity);

  }

  async findByDenominacion(denominacion: string): Promise<Producto | null> {
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

  async existsByDenominacion(
    denominacion: string,
    excludeId?: number,
  ): Promise<boolean> {
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('producto')
        .where('producto.denominacion = :denominacion', { denominacion })
        .andWhere('producto.deletedAt IS NULL');

      if (excludeId) {
        queryBuilder.andWhere('producto.id != :excludeId', { excludeId });
      }

      const count = await queryBuilder.getCount();
      return count > 0;
    } catch (error) {
      this.logger.error(
        `Error verificando existencia de denominación:}`,
      );
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByDenominacionCodigoProveedorFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: Producto[]; total: number }> {
    try {
      const query = this.repository
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.marca', 'marca')
        .leftJoinAndSelect('producto.linea', 'linea')

      query.andWhere('producto.deletedAt IS NULL');
      query.orderBy('producto.denominacion', 'ASC');
      // Paginación
      query.skip(skip).take(take);

      const [data, total] = await query.getManyAndCount();

      return { data, total };
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async existsProductosActivosByMarca(marcaId: number): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('producto')
      .where('producto.marca_id = :marcaId', { marcaId })
      .andWhere('producto.deletedAt IS NULL')
      .limit(1)
      .getCount();

    return count > 0;
  }

  async existsProductosActivosByLinea(lineaId: number): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('producto')
      .where('producto.linea_id = :lineaId', { lineaId })
      .andWhere('producto.deletedAt IS NULL')
      .limit(1) // opcional, para optimizar
      .getCount();

    return count > 0;
  }

  // En ProductoService
  async findByIds(ids: number[]): Promise<Producto[]> {

    const uniqueIds = [...new Set(ids)];

    if (uniqueIds.length === 0) {
      return [];
    }

    return await this.repository
      .createQueryBuilder('producto')
      .where('producto.id IN (:...ids)', { ids: uniqueIds })
      .getMany();
  }


  async existsByCodigoProveedor(codigoProveedor: string, excludeId: number): Promise<boolean> {
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('producto')
        .where('producto.codigoProveedor = :codigoProveedor', { codigoProveedor })
        .andWhere('producto.deletedAt IS NULL');

      if (excludeId) {
        queryBuilder.andWhere('producto.id != :excludeId', { excludeId });
      }

      const count = await queryBuilder.getCount();
      return count > 0;
    } catch (error) {
      this.logger.error(
        `Error verificando existencia de denominación:}`,
      );
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

}

