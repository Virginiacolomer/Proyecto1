import { Injectable, Logger } from '@nestjs/common';
import { ILineaRepository } from '../../domain/interfaces/linea.repository.interface';
import { CreateLineaDto } from '../../dto/create-linea.dto';
import { Linea } from '../../domain/entities/linea.entity';
import { UpdateLineaDto } from '../../dto/update-linea.dto';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { LineaPersistenceAdapter } from './linea.persistence-adapter';

@Injectable()
export class LineaRepository implements ILineaRepository {
  constructor(private readonly persistenceService: LineaPersistenceAdapter) {}

  private readonly logger = new Logger(LineaRepository.name);

  private readonly ENTITY_NAME = 'Linea';

  async create(data: CreateLineaDto): Promise<Linea> {
    this.logger.log(`Creando un nuevo `);
    try {
      return await this.persistenceService.create(data);
    } catch (error) {

      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async update(
    id: number,
    data: UpdateLineaDto,
  ): Promise<Linea> {
    return this.persistenceService.update(id, data);
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados=false,
  ): Promise<{ data: Linea[]; total: number }> {
    this.logger.log(
      `Buscando 333o ${denominacion}  skip=${skip}, take=${take}`,
    );
    return this.persistenceService.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  async findAllFor(denominacion: string): Promise<Linea[]> {
    this.logger.log(`Buscando 333o `);
    return this.persistenceService.findAllFor(denominacion);
  }

  async findAllSinSistemaFor(denominacion: string): Promise<Linea[]> {
    return this.persistenceService.findAllSinSistemaFor(denominacion);
  }

  async findOne(id: number): Promise<Linea | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findByDenominacion(denominacion: string): Promise<Linea | null> {
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

  async findByDenominacionWith(denominacion: string): Promise<Linea | null> {
    const entity =
      await this.persistenceService.findByDenominacionWith(denominacion);
    return entity;
  }

  async remove(data: Linea, usuario: Usuario): Promise<Linea> {
    const entity = this.persistenceService.remove(data, usuario);
    return entity;
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    const entity = await this.persistenceService.findByIdConAuditoria(id);
    return entity;
  }
  
  async findAllListado(): Promise<Linea[]>{
    return this.persistenceService.findAllListado();
  }
  
}
