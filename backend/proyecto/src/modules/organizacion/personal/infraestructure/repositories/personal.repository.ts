import { Injectable, Logger } from "@nestjs/common";
import { IPersonalRepository } from "../../domain/interfaces/personal.interface";
import { PersonalPersistenceAdapter } from "./personal.persistence-adapters";
import { Personal } from "../../domain/entities/personal.entity";
import { CreatePersonalDto } from "../../dto/create-personal.dto";
import { UpdatePersonalDto } from "../../dto/update-personal.dto";
import { DatabaseConnectionException } from "src/modules/common/exceptions/database-connection.exception";
import { Usuario } from "src/modules/gestion-usuario/usuario/domain/entities/usuario.entity";

@Injectable()
export class PersonalRepository implements IPersonalRepository {
    private readonly logger = new Logger(PersonalRepository.name);

    constructor(private readonly persistenceService: PersonalPersistenceAdapter) { }

    private readonly ENTITY_NAME = 'Personal';

    async create(data: CreatePersonalDto,usuario:Usuario): Promise<Personal> {
        this.logger.log(`Creando un nuevo 1 ...`);
        try {
            return await this.persistenceService.create(data,usuario);
        } catch (error) {
            this.logger.error(`Error al crear ${this.ENTITY_NAME}: }`);
            throw new DatabaseConnectionException('No se pudo crear la entidad en la base de datos.');
        }
    }

   async findAllFor(denominacion: string): Promise<Personal[]> {
        return this.persistenceService.findAllFor(denominacion); 
    }

    async update(id: number, data: UpdatePersonalDto,usuario:Usuario): Promise<Personal> {
        return this.persistenceService.update(id, data,usuario);
    }

    async findAll(skip = 0, take = 10): Promise<Personal[]> {
        return this.persistenceService.findAll(skip, take);
    }

    async findAllListado(): Promise <Personal[]>{
        return await this.persistenceService.findAllListado();
    }

    async findBy(
        denominacion: string,
        skip = 0,
        take = 10,
        incluirEliminados = false,
    ): Promise<{ data: Personal[]; total: number }>  {
        this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
        return this.persistenceService.findBy(denominacion, skip, take, incluirEliminados);
    }

    async findOne(id: number): Promise<Personal | null> {
        const entity = await this.persistenceService.findOne(id);
        return entity;
    }

    async findByIdConAuditoria(id: number): Promise<Personal | null> {
        const entity = await this.persistenceService.findByIdConAuditoria(id);
        return entity;
     }
    
    async findByDenominacion(denominacion: string): Promise<Personal | null> {
        const entity = await this.persistenceService.findByDenominacion(denominacion);
        if (!entity) {
            this.logger.warn(`No se encontró ${this.ENTITY_NAME} con denominación: ${denominacion}`);
            return null;
        }
        return entity;
    }

    async    findAllVendedorFor(denominacion: string): Promise<Personal[]> {
      const entity = await this.persistenceService.findAllVendedorFor(denominacion);
        return entity;
    }
 

    async remove(id: number): Promise<Personal> {
        const entity = this.persistenceService.remove(id);
        return entity;
    }

}