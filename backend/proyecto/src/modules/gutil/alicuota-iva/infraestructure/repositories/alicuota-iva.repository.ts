import { Injectable, Logger } from '@nestjs/common';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { IAlicuotaIvaRepository } from '../../domain/interfaces/alicuota-iva.repository.interface';
import { AlicuotaIva } from '../../domain/entities/alicuota-iva.entity';
import { CreateAlicuotaIvaDto } from '../../dto/create-alicuota-iva.dto';
import { AlicuotaIvaPersistenceAdapter } from './alicuota-iva.persistence-adapters';

@Injectable()
export class AlicuotaIvaRepository implements IAlicuotaIvaRepository {
  private readonly logger = new Logger(AlicuotaIvaRepository.name);

  constructor(private readonly persistenceService: AlicuotaIvaPersistenceAdapter) {}


  private readonly ENTITY_NAME = 'AlicuotaIva';

  async create(data: CreateAlicuotaIvaDto): Promise<AlicuotaIva> {
    try {
      return await this.persistenceService.create(data);
    } catch (error) {
 
      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async update(id: number, data: Partial<AlicuotaIva>): Promise<AlicuotaIva> {
    return this.persistenceService.update(id, data);
  }

  async findAllFor(denominacion: string): Promise<AlicuotaIva[]> {
    return this.persistenceService.findAllFor(denominacion);
  }

  async findAllListado(): Promise<AlicuotaIva[]> {
    return this.persistenceService.findAllListado();
  }

  async findAllSinSistemaFor(denominacion: string): Promise<AlicuotaIva[]> {
    return this.persistenceService.findAllSinSistemaFor(denominacion);
  }

  async findAllSistemaFor(denominacion: string): Promise<AlicuotaIva[]> {
    return this.persistenceService.findAllSistemaFor(denominacion);
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: AlicuotaIva[]; total: number }> {
    this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    return this.persistenceService.findBy(
      denominacion,
      skip,
      take,
    );
  }

  async findOne(id: number): Promise<AlicuotaIva | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findByDenominacion(denominacion: string): Promise<AlicuotaIva  | null> {
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

  async remove(data: AlicuotaIva , usuario: Usuario): Promise<AlicuotaIva > {
    const entity = this.persistenceService.remove(data, usuario);
    return entity;
  }

  async findByDenominacionWith(denominacion: string): Promise<AlicuotaIva  | null> {
      const entity = await this.persistenceService.findByDenominacionWith(denominacion);
      return entity;
  }
 

}
