import { Injectable, Logger } from '@nestjs/common';

import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { ConfiguracionSistemaPersistenceAdapter } from './configuracion-sistema-adapters';
import { IConfiguracionSistemaRepository } from '../../domain/interfaces/configuracion-sistema.repository.interface';
import { ConfiguracionSistema } from '../../domain/entities/configuracion-sistema.entity';
import { CreateConfiguracionSistemaDto } from '../../dto/create-configuracion-sistema.dto';

@Injectable()
export class ConfiguracionSistemaRepository
  implements IConfiguracionSistemaRepository
{
  private readonly logger = new Logger(ConfiguracionSistemaRepository.name);

  constructor(
    private readonly persistenceService: ConfiguracionSistemaPersistenceAdapter,
  ) {}

  private readonly ENTITY_NAME = 'Configuracion Sistema';

  async create(
    data: CreateConfiguracionSistemaDto,
  ): Promise<ConfiguracionSistema> {
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
    data: Partial<ConfiguracionSistema>,
  ): Promise<ConfiguracionSistema> {
    return this.persistenceService.update(id, data);
  }

  async findDtoByEmpresaId(
    empresaId: number,
  ): Promise<ConfiguracionSistema | null> {
    return this.persistenceService.findDtoByEmpresaId(empresaId);
  }

  async findOne(id: number): Promise<ConfiguracionSistema | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async remove(data: ConfiguracionSistema): Promise<ConfiguracionSistema> {
    const entity = this.persistenceService.remove(data);
    return entity;
  }
}
