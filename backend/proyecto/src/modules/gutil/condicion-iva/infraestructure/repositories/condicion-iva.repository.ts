
import { Injectable, Logger } from '@nestjs/common';
import { CreateCondicionIvaDto } from '../../dto/create-condicion-iva.dto';
import { ICondicionIvaRepository } from '../../domain/interfaces/condicion-iva.repository.interface';
import { CondicionIvaPersistenceAdapter } from './condicion-iva.persistence-adapters';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { CondicionIva } from '../../domain/entities/condicion-iva.entity';


@Injectable()
export class CondicionIVARepository implements ICondicionIvaRepository {

    private readonly logger = new Logger(CondicionIVARepository.name);

    constructor(private readonly persistenceService: CondicionIvaPersistenceAdapter) { }

    private readonly ENTITY_NAME = 'Condicion IVA';

    async create(data: CreateCondicionIvaDto): Promise<CondicionIva> {
        this.logger.log(`Creando un nuevo `);
        try {
            return await this.persistenceService.create(data);
        } catch (error) {
            this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
            throw new DatabaseConnectionException('No se pudo crear la entidad en la base de datos.');
        }
    }

    async update(id: number, data: Partial<CondicionIva>): Promise<CondicionIva> {
        return this.persistenceService.update(id, data);
    }

    async findAll(skip = 0, take = 10): Promise<CondicionIva[]> {
        return this.persistenceService.findAll(skip, take);
    }

    async findAllListado():Promise<CondicionIva[]>{
        return await this.persistenceService.findAllListado()
    }

    async findByDenominacionFiltered(
        denominacion: string,
        skip = 0,
        take = 10,
    ): Promise<{ data: CondicionIva[]; total: number }> {
        this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
        return this.persistenceService.findByDenominacionFiltered(denominacion, skip, take);
    }

    async findAllFor(): Promise<CondicionIva[]> {
        return this.persistenceService.findAllFor();
    }

    async findOne(id: number): Promise<CondicionIva | null> {
        const entity = await this.persistenceService.findOne(id);
        return entity;
    }

    async findByDenominacion(denominacion: string): Promise<CondicionIva | null> {
        const entity = await this.persistenceService.findByDenominacion(denominacion);
        if (!entity) {
            this.logger.warn(`No se encontró ${this.ENTITY_NAME} con denominación: ${denominacion}`);
            return null;
        }
        return entity;
    }


    async remove(data: CondicionIva): Promise<CondicionIva> {
        const entity = this.persistenceService.remove(data);
        return entity;
    }

  async findByIdConAuditoria(id: number): Promise<AuditoriaDto | null> {
    const entity = await this.persistenceService.findByIdConAuditoria(id);
    return entity;
  }

}