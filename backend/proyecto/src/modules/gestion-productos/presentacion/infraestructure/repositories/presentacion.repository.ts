import { Injectable, Logger } from '@nestjs/common';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { Presentacion } from '../../domain/entities/presentacion.entity';
import { IPresentacionRepository } from '../../domain/interfaces/presentacion.repository.interface';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { PresentacionPersistenceAdapter } from './presentacion.persistence-adapters';

@Injectable()
export class PresentacionRepository implements IPresentacionRepository {
  private readonly logger = new Logger(PresentacionRepository.name);

  constructor(private readonly persistenceService: PresentacionPersistenceAdapter) {}

  private readonly ENTITY_NAME = 'Presentacion';

  async create(data: CreatePresentacionDto): Promise<Presentacion> {
    try {
      return await this.persistenceService.create(data);
    } catch (error) {
      this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async update(id: number, data: Partial<Presentacion>): Promise<Presentacion> {
    return this.persistenceService.update(id, data);
  }

  async findAllFor(denominacion: string): Promise<Presentacion[]> {
    return this.persistenceService.findAllFor(denominacion);
  }

  async findAllListado(): Promise<Presentacion[]> {
    return this.persistenceService.findAllListado();
  }

  async findAllSinSistemaFor(denominacion: string): Promise<Presentacion[]> {
    return this.persistenceService.findAllSinSistemaFor(denominacion);
  }

  async findAllSistemaFor(denominacion: string): Promise<Presentacion[]> {
    return this.persistenceService.findAllSistemaFor(denominacion);
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: Presentacion[]; total: number }> {
    this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    return this.persistenceService.findBy(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  async findOne(id: number): Promise<Presentacion | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findByDenominacion(denominacion: string): Promise<Presentacion | null> {
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

  async remove(data: Presentacion, usuario: Usuario): Promise<Presentacion> {
    const entity = this.persistenceService.remove(data, usuario);
    return entity;
  }

  async findByDenominacionWith(denominacion: string): Promise<Presentacion | null> {
      const entity = await this.persistenceService.findByDenominacionWith(denominacion);
      return entity;
  }

}
