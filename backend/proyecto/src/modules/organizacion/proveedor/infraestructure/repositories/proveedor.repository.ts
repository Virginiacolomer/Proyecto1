import { Injectable, Logger } from '@nestjs/common';
import { IProveedorRepository } from '../../domain/interfaces/proveedor.interface';
import { CreateProveedorDto } from '../../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../../dto/update-proveedor.dto';
import { ProveedorPersistenceAdapter } from './proveedor.persistence-adapters';
import { DatabaseConnectionException } from 'src/modules/common/exceptions/database-connection.exception';
import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
import { Proveedor } from '../../domain/entities/proveedor.entity';

@Injectable()
export class ProveedorRepository implements IProveedorRepository {
  private readonly logger = new Logger(ProveedorRepository.name);

  constructor(
    private readonly persistenceService: ProveedorPersistenceAdapter,
  ) {}

  private readonly ENTITY_NAME = 'Proveedor';

  async create(
    data: CreateProveedorDto,
    categoriaIVA: CondicionIva,
    localidad: Localidad,
    usuario: Usuario,
  ): Promise<Proveedor> {
    this.logger.log(`Creando un nuevo 1 ...`);

    try {
      return await this.persistenceService.create(
        data,
        categoriaIVA,
        localidad,
        usuario,
      );
    } catch (error) {

      throw new DatabaseConnectionException(
        'No se pudo crear la entidad en la base de datos.',
      );
    }
  }

  async update(
    id: number,
    data: UpdateProveedorDto,
    categoriaIVA: CondicionIva,
    localidad: Localidad,
    usuario: Usuario,
  ): Promise<Proveedor> {
    return this.persistenceService.update(
      id,
      data,
      categoriaIVA,
      localidad,
      usuario,
    );
  }

  async findByIdConAuditoria(id: number): Promise<Proveedor | null> {
    const entity = await this.persistenceService.findByIdConAuditoria(id);
    return entity;
  }

  async findAll(skip = 0, take = 10): Promise<Proveedor[]> {
    return this.persistenceService.findAll(skip, take);
  }

  async findBy(
    denominacion: string,
    condicionIvaId: number,
    incluirEliminados: boolean,
    empresaId?: number,
    conSaldo?: boolean,
    skip = 0,
    take = 10,
  ): Promise<{ data: Proveedor[]; total: number }> {
    this.logger.log(`Buscando Ro ${denominacion}  skip=${skip}, take=${take}`);
    return this.persistenceService.findBy(
      denominacion,
      condicionIvaId,
      incluirEliminados,
      empresaId,
      conSaldo,
      skip,
      take,
    );
  }

  async findAllByDenominacion(denominacion: string): Promise<Proveedor[]> {
    this.logger.log(`Buscando o ${denominacion} `);
    return this.persistenceService.findAllByDenominacion(denominacion);
  }

  async findOne(id: number): Promise<Proveedor | null> {
    const entity = await this.persistenceService.findOne(id);
    return entity;
  }

  async findByDenominacion(denominacion: string): Promise<Proveedor | null> {
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

  async remove(id: number): Promise<Proveedor> {
    const entity = this.persistenceService.remove(id);
    return entity;
  }

  async findAllFor(denominacion: string): Promise<Proveedor[]> {
    return this.persistenceService.findAllFor(denominacion);
  }

  async findAllSistemaFor(denominacion: string): Promise<Proveedor[]> {
    return this.persistenceService.findAllSistemaFor(denominacion);
  }

  async findAllSinSistemaFor(denominacion: string): Promise<Proveedor[]> {
    return this.persistenceService.findAllSinSistemaFor(denominacion);
  }

  async findByCuit(cuit: string): Promise<Proveedor | null> {
    return this.persistenceService.findByCuit(cuit);
  }

  async findPendientesByProveedores(
    proveedoresIds: number[],
  ): Promise<{ proveedorId: number; cantidad: number }[]> {
    return this.persistenceService.findPendientesByProveedores(proveedoresIds);
  }

  async findAllByTipo(
    denominacion: string,
    compra: boolean,
    gasto: boolean,
  ): Promise<Proveedor[]> {
    return this.persistenceService.findAllByTipo(denominacion, compra, gasto);
  }
}
