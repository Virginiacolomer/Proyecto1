import { Injectable, Logger } from '@nestjs/common';
import { ISuperLineaRepository } from '../../domain/interfaces/super-linea.repository.interface';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { SuperLinea } from '../../domain/entities/super-linea.entity';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { SuperLineaPersistenceAdapter } from './super-linea.persistence-adapter';

@Injectable()
export class SuperLineaRepository implements ISuperLineaRepository {
  constructor(private readonly persistenceService: SuperLineaPersistenceAdapter) {}

  private readonly logger = new Logger(SuperLineaRepository.name);
  private readonly ENTITY_NAME = 'SuperLínea';

  async create(data: CreateSuperLineaDto): Promise<SuperLinea> {
    try {
      return await this.persistenceService.create(data);
    } catch (error) {
      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async update(id: number, data: UpdateSuperLineaDto): Promise<SuperLinea> {
    return this.persistenceService.update(id, data);
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: SuperLinea[]; total: number }> {
    return this.persistenceService.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  async findAllListado(): Promise<SuperLinea[]> {
    return this.persistenceService.findAllListado();
  }

  async findOne(id: number): Promise<SuperLinea | null> {
    return this.persistenceService.findOne(id);
  }

  async findByDenominacion(denominacion: string): Promise<SuperLinea | null> {
    return this.persistenceService.findByDenominacion(denominacion);
  }

  async findByDenominacionWith(denominacion: string): Promise<SuperLinea | null> {
    return this.persistenceService.findByDenominacionWith(denominacion);
  }

  async remove(data: SuperLinea, usuario: Usuario): Promise<SuperLinea> {
    return this.persistenceService.remove(data, usuario);
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    return this.persistenceService.findByIdConAuditoria(id);
  }

  async existsLineasActivasBySuperLinea(superLineaId: number): Promise<boolean> {
    return this.persistenceService.existsLineasActivasBySuperLinea(superLineaId);
  }
}
