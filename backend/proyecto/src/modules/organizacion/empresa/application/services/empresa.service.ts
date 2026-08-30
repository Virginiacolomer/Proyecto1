import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from '../../dto/create-empresa.dto';
import { UpdateEmpresaDto } from '../../dto/update-empresa.dto';
import { Empresa } from '../../domain/entities/empresa.entity';
import { IEmpresaRepository } from '../../domain/interfaces/empresa.interface';
import { CondicionIvaService } from 'src/modules/gutil/condicion-iva/application/services/condicion-iva.service';

@Injectable()
export class EmpresaService {

  private readonly logger = new Logger(EmpresaService.name);
  constructor(
    @Inject('IEmpresaRepository')
    private readonly repository: IEmpresaRepository,

    private readonly condicionIvaService: CondicionIvaService,

  ) { }

  private readonly ENTITY_NAME = 'Empresa';

  async create(dto: CreateEmpresaDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`);
    await this.checkDenominacionExists(dto.denominacion, 0);

    const categoriaIVA = await this.condicionIvaService.findEntityById(dto.condicionIVAId);

    if (!categoriaIVA) {
      throw new NotFoundException(`Condicion  IVA con ID ${dto.condicionIVAId} no encontrada`);
    }
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME} con denominación: ${categoriaIVA.denominacion} a: ${categoriaIVA.denominacion}`);
    return this.repository.create(dto, categoriaIVA);
  }

  async update(id: number, dto: UpdateEmpresaDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);

    await this.findOne(id); // Verifica existencia
    if (dto.denominacion) await this.checkDenominacionExists(dto.denominacion, id);


    const categoriaIVAId = dto.condicionIVAId;
    if (categoriaIVAId === undefined) {
      throw new Error('Condicion IVA ID is required');
    }

    const categoriaIVA = await this.condicionIvaService.findEntityById(categoriaIVAId);
    if (!categoriaIVA) {
      throw new NotFoundException(`Condición con ID ${dto.condicionIVAId} no encontrada`);
    }

    return this.repository.update(id, dto, categoriaIVA);
  }

  async findAll(skip = 0, take = 10) {
    return this.repository.findAll(skip, take);
  }

  async findByDenominacionFiltered(denominacion: string, skip = 0, take = 10): Promise<Empresa[]> {
    this.logger.log(`  Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    return this.repository.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
    );
  }

  async findOne(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity) throw new NotFoundException(`${this.ENTITY_NAME} con ID ${id} no encontrado.`)
    return entity;
  }

 async findOneWithRelations(id: number) {
    const entity = await this.repository.findOneWithRelations(id);
    if (!entity) throw new NotFoundException(`${this.ENTITY_NAME} con ID ${id} no encontrado.`)
    return entity;
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (!entity) throw new NotFoundException(`${this.ENTITY_NAME} con ID ${id} no encontrado.`);
    return this.repository.remove(id);
  }

  private async checkDenominacionExists(denominacion: string, id: number) {
    const exists = await this.repository.findByDenominacion(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(`${this.ENTITY_NAME} Conflicto: denominación ya está en uso: ${denominacion}`);
      throw new ConflictException('Denominación ya en uso.');
    }
  }

  async empresaExist(empresaId: number): Promise<boolean> {
    return  await this.repository.empresaExist(empresaId); 
  }

}



