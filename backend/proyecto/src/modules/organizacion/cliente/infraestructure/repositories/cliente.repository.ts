import { Injectable, Logger } from '@nestjs/common';
import { IClienteRepository } from '../../domain/interfaces/cliente.interface';
import { CreateClienteDto } from '../../dto/create-cliente.dto';
import { UpdateClienteDto } from '../../dto/update-cliente.dto';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Personal } from '../../../personal/domain/entities/personal.entity';
import { ClientePersistenceAdapter } from './cliente.persistence-adapters';
import { Cliente } from '../../domain/entities/cliente.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  private readonly logger = new Logger(ClienteRepository.name);

  constructor(private readonly persistenceService: ClientePersistenceAdapter) {}

  private readonly ENTITY_NAME = 'Cliente';

  async create(
    data: CreateClienteDto,
    categoriaIVA: CondicionIva,
    ciudad: Localidad,
    personal: Personal,
    usuario: Usuario,
  ): Promise<Cliente> {
    this.logger.log(`Creando un nuevo 1 ...`);

    try {
      return await this.persistenceService.create(
        data,
        categoriaIVA,
        ciudad,
        personal,
        usuario,
      );
    } catch (error) {
      this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async update(
    id: number,
    data: UpdateClienteDto,
    categoriaIVA: CondicionIva,
    localidad: Localidad,
    personal: Personal,
    usuario: Usuario,
  ): Promise<Cliente> {
    return this.persistenceService.update(
      id,
      data,
      categoriaIVA,
      localidad,
      personal,
      usuario,
    );
  }

  async findByIdConAuditoria(id: number): Promise<Cliente | null> {
    const entity = await this.persistenceService.findByIdConAuditoria(id);
    return entity;
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<Cliente[]> {
    this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    return this.persistenceService.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
    );
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
    this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    return this.persistenceService.findBy(
      denominacion,
      condicionIvaId,
      incluirEliminados,
      empresaId,
      conSaldo,
      skip,
      take,
    );
  }

  async findAllByDenominacion(denominacion: string): Promise<Cliente[]> {
    this.logger.log(`Buscando o ${denominacion} `);
    return this.persistenceService.findAllByDenominacion(denominacion);
  }

  async findAllByDenominacionAndCodigo(
    denominacion: string,
  ): Promise<Cliente[]> {
    this.logger.log(`Buscando o ${denominacion} `);
    return this.persistenceService.findAllByDenominacionAndCodigo(denominacion);
  }

  async findOne(id: number): Promise<Cliente | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findOneWithRelations(id: number): Promise<Cliente | null> {
    const entity = await this.persistenceService.findOneWithRelations(id);
    return entity;
  }

  async findByDenominacion(denominacion: string): Promise<Cliente | null> {
    const entity =
      await this.persistenceService.findByDenominacion(denominacion);
    if (!entity) {
      this.logger.warn(
        `No se encontró ${this.ENTITY_NAME} con denominación: ${denominacion}`,
      );
      return null;
    }
    return entity;
  }

  async remove(id: number, usuario: Usuario): Promise<Cliente> {
    const entity = this.persistenceService.remove(id, usuario);
    return entity;
  }

  async findByCuit(cuit: string): Promise<Cliente | null> {
    return this.persistenceService.findByCuit(cuit);
  }

  async findByDni(dni: string): Promise<Cliente | null> {
    return this.persistenceService.findByDni(dni);
  }



}
