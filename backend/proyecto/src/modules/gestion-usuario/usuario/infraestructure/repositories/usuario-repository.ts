import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '../../domain/entities/usuario.entity';
import { IUsuarioRepository } from '../../domain/interfaces/usuario-repository.interface';
import { UsuarioPersistenceAdapter } from './usuario-persistence-adapters';
import { Rol } from '../../../rol/domain/entities/rol.entity';
import { RegistrarUsuarioDto } from '../../../auth/dto/register.dto';
import { UpdateUsuarioDto } from '../../dto/updateUsuario.dto';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { CreateUsuarioDto } from '../../dto/create-usuario.dto';
import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  private readonly logger = new Logger(UsuarioRepository.name);

  constructor(private readonly persistenceService: UsuarioPersistenceAdapter) {}

  private readonly ENTITY_NAME = 'Usuario';

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: Usuario[]; total: number }> {
    this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    return this.persistenceService.findBy(denominacion, skip, take);
  }

  async findOne(id: number): Promise<Usuario | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findByMail(mail: string): Promise<Usuario | null> {
    const entity = this.persistenceService.findByMail(mail);
    return entity;
  }

  async update(id: number, data: UpdateUsuarioDto, rol: Rol): Promise<Usuario> {
    return this.persistenceService.update(id, data, rol);
  }

  async findAll(skip = 0, take = 10): Promise<Usuario[]> {
    return this.persistenceService.findAll(skip, take);
  }

  async create(data: RegistrarUsuarioDto, rol: Rol): Promise<Usuario> {
    this.logger.log(`Creando un nuevo `);

    try {
      return await this.persistenceService.create(data, rol);
    } catch (error) {
      this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async remove(id: number): Promise<Usuario> {
    const entity = this.persistenceService.remove(id);
    return entity;
  }

  async findByMailFiltered(
    mail: string,
    skip = 0,
    take = 10,
  ): Promise<Usuario[]> {
    return this.persistenceService.findByMailFiltered(mail, skip, take);
  }

  async save(usuario: Usuario): Promise<Usuario> {
    try {
      return await this.persistenceService.save(usuario);
    } catch (error) {
      this.logger.error(
        `Error al guardar ${this.ENTITY_NAME}: ${error.message}`,
      );
      throw new DatabaseConnectionException(
        'No se pudo guardar la entidad en la base de datos.',
      );
    }
  }

  async findOneWithRoles(id: number): Promise<Usuario | null> {
    return this.persistenceService.findOneWithRoles(id);
  }

  async updateContrasena(usuario: Usuario): Promise<Usuario> {
      return this.persistenceService.updateContrasena(usuario);
  }

   async updateDatos(usuario: Usuario): Promise<Usuario> {
      return this.persistenceService.updateDatos(usuario);
  }

  async createUsuarioFor(personal: Personal, uow: IUnitOfWork): Promise<Usuario> {    
    return this.persistenceService.createUsuarioFor(personal, uow);
  }
}
