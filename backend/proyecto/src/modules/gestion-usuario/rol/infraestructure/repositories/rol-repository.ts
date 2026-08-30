
import { Injectable, Logger } from "@nestjs/common";
import { CreateRolDto } from "../../dto/create-rol.dto";
import { UpdateRolDto } from "../../dto/update-rol.dto";
import { Rol } from "../../domain/entities/rol.entity";
import { IRolRepository } from "../../domain/interfaces/rol-repository.interface";
import { RolPersistenceAdapter } from "./rol-persistence-adapters";
import { DatabaseConnectionException } from "src/modules/common/exceptions/database-connection.exception";

@Injectable()
export class RolRepository implements IRolRepository {
    private readonly logger = new Logger(RolRepository.name);

    constructor(private readonly persistenceService: RolPersistenceAdapter) { }

    private readonly ENTITY_NAME = 'Rol';

    async create(data: CreateRolDto): Promise<Rol> {
        try {
            return await this.persistenceService.create(data);
        } catch (error) {
            this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
            throw new DatabaseConnectionException('No se pudo crear la entidad en la base de datos.');
        }
    }

    async update(id: number, data: UpdateRolDto): Promise<Rol> {
        return this.persistenceService.update(id, data);
    }

    async findAll(skip = 0, take = 10): Promise<Rol[]> {
        return this.persistenceService.findAll(skip, take);
    }

    async findByDenominacionFiltered(
        denominacion: string,
        skip = 0,
        take = 10,
    ): Promise<Rol[]> {
        return this.persistenceService.findByDenominacionFiltered(denominacion, skip, take);
    }

    async findOne(id: number): Promise<Rol | null> {
        const entity = await this.persistenceService.findOne(id);
        return entity;

    }

    async findByDenominacion(denominacion: string): Promise<Rol | null> {
        const entity = await this.persistenceService.findByDenominacion(denominacion);
        if (!entity) {
            this.logger.warn(`No se encontró ${this.ENTITY_NAME} con denominación: ${denominacion}`);
            return null;
        }
        return entity;
    }

    async remove(id: number): Promise<Rol> {
        const entity = this.persistenceService.remove(id);
        return entity;
    }

    async findByIds(ids: number[]): Promise<Rol[]> {
        return this.persistenceService.findByIds(ids);
    }

}