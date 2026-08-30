import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCondicionIvaDto } from '../../dto/create-condicion-iva.dto';
import { UpdateCondicionIvaDto } from '../../dto/update-condicion-iva.dto';
import { ICondicionIvaRepository } from '../../domain/interfaces/condicion-iva.repository.interface';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { CondicionIvaDto } from '../../dto/condicion-iva.dto';
import { CondicionIvaMapper } from '../../mappers/condicion-iva.mapper';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { CondicionIva } from '../../domain/entities/condicion-iva.entity';

@Injectable()
export class CondicionIvaService {
  private readonly logger = new Logger(CondicionIvaService.name);

  constructor(
    @Inject('ICondicionIvaRepository')
    private readonly repository: ICondicionIvaRepository,
  ) {}

  private readonly ENTITY_NAME = 'Condición IVA';

  async create(dto: CreateCondicionIvaDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );
    await this.checkDenominacionExists(dto.denominacion, 0);
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateCondicionIvaDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    await this.findEntityById(id); // Verifica existencia
    if (dto.denominacion)
      await this.checkDenominacionExists(dto.denominacion, id);
    return this.repository.update(id, dto);
  }

  async findByDenominacionFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: CondicionIvaDto[]; total: number }> {
    const result = await this.repository.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
    );
    const data = result.data.map((condicion) =>
      CondicionIvaMapper.toDto(condicion),
    );

    return {
      data,
      total: PaginacionUtils.totalItems(result.total),
    };
  }

  async findAllFor(): Promise<ListadoConTotalDto<CondicionIvaDto>> {
    const condiciones = await this.repository.findAllFor();
    const data = condiciones.map((condicion) =>
      CondicionIvaMapper.toDto(condicion),
    );

    return {
      data,
      total: PaginacionUtils.totalItems(data.length),
    };
  }
  async findAllSinConsumidorFinal(): Promise<
    ListadoConTotalDto<CondicionIvaDto>
  > {
    const condiciones = await this.repository.findAllFor();
    const data = condiciones
      .filter((condicion) => condicion.id !== 5) 
      .map((condicion) => CondicionIvaMapper.toDto(condicion));

    return {
      data,
      total: PaginacionUtils.totalItems(data.length),
    };
  }

  async findDtoById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return CondicionIvaMapper.toDto(entity);
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }

  async remove(id: number) {
    const entity = await this.findEntityById(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return this.repository.remove(entity);
  }

  private async checkDenominacionExists(denominacion: string, id: number) {
    const exists = await this.repository.findByDenominacion(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(
        `${this.ENTITY_NAME} Conflicto: denominación ya está en uso: ${denominacion}`,
      );
      throw new ConflictException('Denominación ya en uso.');
    }
  }

  async findAllListado(): Promise<CondicionIva[]> {
      const result = await this.repository.findAllListado();
      return result;
  }
  
  async findByIdConAuditoria(id: number) {
      const entity = await this.repository.findByIdConAuditoria(id);
      if (!entity)
        throw new NotFoundException(
          `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
        );
             this.logger.warn(`FindOne : ${JSON.stringify(entity)}.`);
             
       return entity;
    }

}
