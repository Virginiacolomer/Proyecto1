
import { Injectable, Logger } from "@nestjs/common";
import { IDomicilioRepository } from "./domicilio.repository.interface";
import { DomicilioPersistenceAdapter } from "./domicilio.persistence-adapters";

@Injectable()
export class DomicilioRepository implements IDomicilioRepository {
    private readonly logger = new Logger(DomicilioRepository.name);

    constructor(private readonly persistenceService: DomicilioPersistenceAdapter) { }

    private readonly ENTITY_NAME = 'Domicilio';

    

}