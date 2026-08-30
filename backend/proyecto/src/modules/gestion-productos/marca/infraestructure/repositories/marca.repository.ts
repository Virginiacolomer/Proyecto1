import { Injectable, Logger } from '@nestjs/common';
import { CreateMarcaDto } from '../../dto/create-marca.dto';
import { Marca } from '../../domain/entities/marca.entity';
import { IMarcaRepository } from '../../domain/interfaces/marca.repository.interface';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { MarcaPersistenceAdapter } from './marca.persistence-adapters';

@Injectable()
export class MarcaRepository implements IMarcaRepository {
  private readonly logger = new Logger(MarcaRepository.name);

  constructor(private readonly persistenceService: MarcaPersistenceAdapter) {}

  private readonly ENTITY_NAME = 'Marca';

  async create(data: CreateMarcaDto): Promise<Marca> {
    try {
      return await this.persistenceService.create(data);
    } catch (error) {
      this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async update(id: number, data: Partial<Marca>): Promise<Marca> {
    return this.persistenceService.update(id, data);
  }

  async findAllFor(denominacion: string): Promise<Marca[]> {
    return this.persistenceService.findAllFor(denominacion);
  }

  async findAllListado(): Promise<Marca[]> {
    return this.persistenceService.findAllListado();
  }

  async findAllSinSistemaFor(denominacion: string): Promise<Marca[]> {
    return this.persistenceService.findAllSinSistemaFor(denominacion);
  }

  async findAllSistemaFor(denominacion: string): Promise<Marca[]> {
    return this.persistenceService.findAllSistemaFor(denominacion);
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: Marca[]; total: number }> {
    this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    return this.persistenceService.findBy(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  async findOne(id: number): Promise<Marca | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findByDenominacion(denominacion: string): Promise<Marca | null> {
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
  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    const entity = await this.persistenceService.findByIdConAuditoria(id);
    return entity;
  }

  async remove(data: Marca, usuario: Usuario): Promise<Marca> {
    const entity = this.persistenceService.remove(data, usuario);
    return entity;
  }

  async findByDenominacionWith(denominacion: string): Promise<Marca | null> {
      const entity = await this.persistenceService.findByDenominacionWith(denominacion);
      return entity;
  }

}
