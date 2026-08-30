import { Injectable, Logger } from "@nestjs/common";
import { CreateEmpresaDto } from "../../dto/create-empresa.dto";
import { UpdateEmpresaDto } from "../../dto/update-empresa.dto";
import { Empresa } from "../../domain/entities/empresa.entity";
import { IEmpresaRepository } from "../../domain/interfaces/empresa.interface";
import { EmpresaPersistenceAdapter } from "./empresa.persistence-adapters";
import { DatabaseConnectionException } from "src/modules/common/exceptions/database-connection.exception";
import { CondicionIva } from "src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity";

@Injectable()
export class EmpresaRepository implements IEmpresaRepository {

    private readonly logger = new Logger(EmpresaRepository.name);

    constructor(private readonly persistenceService: EmpresaPersistenceAdapter) { }

    private readonly ENTITY_NAME = 'Empresa';

    async create(data: CreateEmpresaDto, categoriaIVA: CondicionIva): Promise<Empresa> {
        
        this.logger.log(`Creando un nuevo 1 ...`);
        try {
            return await this.persistenceService.create(data, categoriaIVA);
        } catch (error) {
            this.logger.error(`Error al crear ${this.ENTITY_NAME}: ${error.message}`);
            throw new DatabaseConnectionException('No se pudo crear la entidad en la base de datos.');
        }
    }

    async update(id: number, data: UpdateEmpresaDto, categoriaIVA: CondicionIva): Promise<Empresa> {
        return this.persistenceService.update(id, data, categoriaIVA);
    }

    async findAll(skip = 0, take = 10): Promise<Empresa[]> {
        return this.persistenceService.findAll(skip, take);
    }

    async findByDenominacionFiltered(
        denominacion: string,
        skip = 0,
        take = 10,
    ): Promise<Empresa[]> {
        this.logger.log(`Buscando o ${denominacion}  skip=${skip}, take=${take}`);
        return this.persistenceService.findByDenominacionFiltered(denominacion, skip, take);
    }

    async findOne(id: number): Promise<Empresa | null> {
        const entity = await this.persistenceService.findOne(id);
        return entity;
    }
 
    async findOneWithRelations(id: number): Promise<Empresa | null> {
        const entity = await this.persistenceService.findOneWithRelations(id);
        return entity;
    }

    async findByDenominacion(denominacion: string): Promise<Empresa | null> {
        const entity = await this.persistenceService.findByDenominacion(denominacion);
        if (!entity) {
            this.logger.warn(`No se encontró ${this.ENTITY_NAME} con denominación: ${denominacion}`);
            return null;
        }
        return entity;
    }

    async remove(id: number): Promise<Empresa> {
        const entity = this.persistenceService.remove(id);
        return entity;
    }

   async empresaExist(empresaId: number): Promise<boolean> {
        return this.persistenceService.empresaExist(empresaId);     }


}