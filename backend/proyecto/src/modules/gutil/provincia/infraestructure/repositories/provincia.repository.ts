import { Injectable, Logger } from "@nestjs/common";
import { CreateProvinciaDto } from "../../dto/create-provincia.dto";
import { IProvinciaRepository } from "../../domain/interfaces/provincia.repository.interface";
import { ProvinciaPersistenceAdapter } from "./provincia.pesistence-adapter";
import { DatabaseConnectionException } from "src/modules/common/exceptions/database-connection.exception";
import { Provincia } from "../../domain/entities/provincia.entity";

@Injectable()
export class ProvinciaRepository implements IProvinciaRepository {
    private readonly logger = new Logger(ProvinciaRepository.name);

    constructor(private readonly persistenceService: ProvinciaPersistenceAdapter) { }

    private readonly ENTITY_NAME = 'Provinciaa';

    async create(data: CreateProvinciaDto): Promise<Provincia> {
        try {
            return await this.persistenceService.create(data);
        } catch (error) {
            this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
            throw new DatabaseConnectionException('No se pudo crear la entidad en la base de datos.');
        }
    }

    async update(id: number, data: Partial<Provincia>): Promise<Provincia> {
        return this.persistenceService.update(id, data);
    }

    async findAll(skip = 0, take = 10): Promise<Provincia[]> {
        return this.persistenceService.findAll(skip, take);
    }

    async findByDenominacionFiltered(
        denominacion: string,
        skip = 0,
        take = 10,
    ): Promise<Provincia[]> {
        return this.persistenceService.findByDenominacionFiltered(denominacion, skip, take);
    }

    async findAllFor(): Promise<Provincia[]> {
        return this.persistenceService.findAllFor();
    }

    async findOne(id: number): Promise<Provincia | null> {
        const entity = await this.persistenceService.findOne(id);
        return entity;

    }

    async findByDenominacion(denominacion: string): Promise<Provincia | null> {
        const entity = await this.persistenceService.findByDenominacion(denominacion);
        if (!entity) {
            this.logger.warn(`No se encontró ${this.ENTITY_NAME} con denominación: ${denominacion}`);
            return null;
        }
        return entity;
    }

    async remove(data: Provincia): Promise<Provincia> {
        const entity = this.persistenceService.remove(data);
        return entity;
    }


}
