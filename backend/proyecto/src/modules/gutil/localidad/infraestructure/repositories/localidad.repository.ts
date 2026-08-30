import { Injectable, Logger } from '@nestjs/common';
import { CreateLocalidadDto } from '../../dto/create-localidad.dto';
import { Localidad } from '../../domain/entities/localidad.entity';
import { ILocalidadRepository } from '../../domain/interfaces/localidad.repository.interface';
import { UpdateLocalidadDto } from '../../dto/update-localidad.dto';
import { LocalidadPersistenceAdapter } from './localidad.persistence-adapters';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { Provincia } from 'src/modules/gutil/provincia/domain/entities/provincia.entity';

@Injectable()
export class LocalidadRepository implements ILocalidadRepository {
  private readonly logger = new Logger(LocalidadRepository.name);

  constructor(
    private readonly persistenceService: LocalidadPersistenceAdapter,
  ) {}

  private readonly ENTITY_NAME = 'Localidad';

  async create(
    data: CreateLocalidadDto,
    provincia: Provincia,
  ): Promise<Localidad> {
   // this.logger.log(`Creando un nuevo `);
    return await this.persistenceService.create(data, provincia);
  }

  async update(
    id: number,
    data: UpdateLocalidadDto,
    provincia: Provincia,
  ): Promise<Localidad> {
    this.logger.debug(
      `Datos recibidos para actualizar localidad repositorio: id=${id}, data=${JSON.stringify(data)}, provincia=${JSON.stringify(provincia)}`,
    );
    return this.persistenceService.update(id, data, provincia);
  }


  async findAllFor(): Promise<Localidad[]> {
    return this.persistenceService.findAllFor();
  }

  async findAllForProvincia(provinciaId: number): Promise<Localidad[]> {
    return this.persistenceService.findAllForProvincia(provinciaId);
  }

  async findAllListado(): Promise<Localidad[]> {
    return await this.persistenceService.findAllListado();
  }

  async findBy(
    denominacion: string,
    provinciaId: number,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: Localidad[]; total: number }> {
    return this.persistenceService.findBy(
      denominacion,
      provinciaId,
      skip,
      take,
      incluirEliminados,
    );
  }

  async findOne(id: number): Promise<Localidad | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findByDenominacion(denominacion: string): Promise<Localidad | null> {
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

  async remove(id: number): Promise<Localidad> {
    const entity = this.persistenceService.remove(id);
    return entity;
  }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    const entity = await this.persistenceService.findByIdConAuditoria(id);
    return entity;
  }
}
