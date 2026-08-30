import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Repository, IsNull, DataSource } from 'typeorm';
import { IUsuarioRepository } from '../../domain/interfaces/usuario-repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Rol } from '../../../rol/domain/entities/rol.entity';
import { RegistrarUsuarioDto } from '../../../auth/dto/register.dto';
import { UpdateUsuarioDto } from '../../dto/updateUsuario.dto';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';
import * as bcrypt from 'bcrypt';
import { UsuarioPolicy } from './usuario-policy';

@Injectable()
export class UsuarioPersistenceAdapter implements IUsuarioRepository {
  private readonly logger = new Logger(UsuarioPersistenceAdapter.name);

  private readonly ENTITY_NAME = 'Usuario';

  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  async createUsuarioFor(
    personal: Personal,
    uow: IUnitOfWork,
  ): Promise<Usuario> {
    const usuarioRepo = uow.getRepository(Usuario);
    const rolRepo = uow.getRepository(Rol);

    // password por defecto
    const contrasenaHasheada = await bcrypt.hash('12345678', 10);

    // decidir rol según esVendedor
    const rolId = personal.esVendedor ? 4 : 2;

    const rol = await rolRepo.findOne({
      where: { id: rolId },
    });

    if (!rol) {
      throw new Error(`No existe el rol con id ${rolId}`);
    }
    // crear usuario
    const usuario = usuarioRepo.create({
      mail: personal.mail,
      denominacion: personal.denominacion,
      contrasena: contrasenaHasheada,
      personal: personal,
      personalId: personal.id,
      roles: [rol],
      activo: true,
    });

    return await usuarioRepo.save(usuario);
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: Usuario[]; total: number }> {
    try {
      const query = this.repository
        .createQueryBuilder('usuario')
        .where('usuario.deletedAt IS NULL');

      query.andWhere('UPPER(usuario.denominacion) LIKE UPPER(:denominacion)', {
        denominacion: `%${denominacion}%`,
      });

      //  Regla de dominio encapsulada
      UsuarioPolicy.excluirUsuariosSistema(query);

      const [data, total] = await query
        .orderBy('usuario.denominacion', 'ASC')
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

  async update(id: number, data: UpdateUsuarioDto, rol: Rol): Promise<Usuario> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entity = await queryRunner.manager.findOne(Usuario, {
        where: { id },
        relations: ['rol'],
      });

      if (!entity) {
        throw new NotFoundException(`Línea con ID ${id} no encontrada`);
      }

      // 4️⃣ Actualizar línea
      Object.assign(entity, data, { rol });

      const entityActualizada = await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
      return entityActualizada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async create(data: RegistrarUsuarioDto, rol: Rol): Promise<Usuario> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const nuevaData = queryRunner.manager.create(Usuario, {
        ...data,
        rol,
      });

      const dataGuardada = await queryRunner.manager.save(nuevaData);
      await queryRunner.commitTransaction();
      return dataGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error al conectar con la base de datos: ${error.message}`,
      );
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<Usuario> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`${this.ENTITY_NAME}  con ID ${id} no encontrada`);
    }

    if (!entity || entity.deletedAt) {
      throw new NotFoundException('Entidad no encontrada o ya eliminada.');
    }

    try {
      await this.repository.update(id, { deletedAt: new Date() });
      return entity as Usuario;
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async save(usuario: Usuario): Promise<Usuario> {
    try {
      return await this.repository.save(usuario);
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al guardar en la base de datos.',
      );
    }
  }

  async findOne2(id: number): Promise<Usuario | null> {
    try {
      return await this.repository.findOne({
        where: { id, deletedAt: IsNull() },
      });
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOne(id: number): Promise<Usuario | null> {
    try {
      return await this.repository.findOne({
        where: { id, deletedAt: IsNull() },
        relations: ['roles'], // CAMBIO CLAVE anstes era rol
      });
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findAll(skip = 0, take = 10): Promise<Usuario[]> {
    try {
      return await this.repository.find({
        where: { deletedAt: IsNull() },
        relations: ['roles'], // ✅ CAMBIO
        skip,
        take,
      });
    } catch {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findOneWithRoles(id: number): Promise<Usuario | null> {
    return this.repository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['roles'],
    });
  }

  async findByMailFiltered(
    mail: string,
    skip = 0,
    take = 10,
  ): Promise<Usuario[]> {
    try {
      return await this.repository.find({
        where: { mail, deletedAt: IsNull() },
        skip,
        take,
        order: { mail: 'ASC' },
      });
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async findByMail(mail: string): Promise<Usuario | null> {
    try {
      const entity = await this.repository.findOne({
        where: { mail, deletedAt: IsNull() },
        relations: ['roles'],
      });
      return entity;
    } catch (error) {
      throw new DatabaseConnectionException(
        'Error al conectar con la base de datos.',
      );
    }
  }

  async updateContrasena(usuario: Usuario): Promise<Usuario> {
    return await this.repository.save(usuario);
  }

  async updateDatos(usuario: Usuario): Promise<Usuario> {
    return await this.repository.save(usuario);
  }
}
