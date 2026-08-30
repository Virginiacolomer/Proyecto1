import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProvinciaDto } from '../../dto/create-provincia.dto';
import { UpdateProvinciaDto } from '../../dto/update-provincia.dto';
import { IProvinciaRepository } from '../../domain/interfaces/provincia.repository.interface';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { ProvinciaDto } from '../../dto/provincia.dto';
import { ProvinciaMapper } from '../../mappers/provincia.mapper';

@Injectable()
export class ProvinciaService {
  private readonly logger = new Logger(ProvinciaService.name);

  constructor(
    @Inject('IProvinciaRepository')
    private readonly repository: IProvinciaRepository,
  ) { }

  private readonly ENTITY_NAME = 'Provincia';

  async create(dto: CreateProvinciaDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`);
    await this.checkDenominacionExists(dto.denominacion,0);
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateProvinciaDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    await this.findOne(id); // Verifica existencia
    if (dto.denominacion) await this.checkDenominacionExists(dto.denominacion,id);
    return this.repository.update(id, dto);
  }

  async findAll(skip = 0, take = 10) {
    return this.repository.findAll(skip, take);
  }

  async findByDenominacionFiltered(denominacion: string, skip = 0, take = 10) {
    return this.repository.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
    );
  }
  
  async findAllFor(): Promise<ListadoConTotalDto<ProvinciaDto>> {
     const provincias = await this.repository.findAllFor();
     const data = provincias.map((entity) =>
       ProvinciaMapper.toDto(entity),
     );
 
     return {
       data,
       total: data.length,
     };
   }

  async findOne(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity) throw new NotFoundException(`${this.ENTITY_NAME} con ID ${id} no encontrado.`);
    return entity;
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (!entity) throw new NotFoundException(`${this.ENTITY_NAME} con ID ${id} no encontrado.`);
    return this.repository.remove(entity);
  }

  private async checkDenominacionExists(denominacion: string, id: number) {
    const exists = await this.repository.findByDenominacion(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(`${this.ENTITY_NAME} Conflicto: denominación ya está en uso: ${denominacion}`);
      throw new ConflictException('Denominación ya en uso.');
    }
  }

}
