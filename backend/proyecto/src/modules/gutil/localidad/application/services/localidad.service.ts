import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocalidadDto } from '../../dto/create-localidad.dto';
import { UpdateLocalidadDto } from '../../dto/update-localidad.dto';
import { ILocalidadRepository } from '../../domain/interfaces/localidad.repository.interface';
import { ListadoConTotalDto } from 'src/modules/common/interface/listadoConTotalDto';
import { LocalidadDto } from '../../dto/localidad.dto';
import { LocalidadMapper } from '../../mappers/localidad.mapper';
import { ProvinciaDto } from '../../../provincia/dto/provincia.dto';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { ProvinciaService } from 'src/modules/gutil/provincia/application/services/provincia.service';
import { Localidad } from '../../domain/entities/localidad.entity';

@Injectable()
export class LocalidadService {
  private readonly logger = new Logger(LocalidadService.name);
  constructor(
    @Inject('ILocalidadRepository')
    private readonly repository: ILocalidadRepository,
    private readonly provinciaService: ProvinciaService,
  ) {}

  private readonly ENTITY_NAME = 'Localidad';

  async create(dto: CreateLocalidadDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );
    await this.checkDenominacionExists(dto.denominacion, 0);

    const provincia = await this.provinciaService.findOne(dto.provinciaId);
    if (!provincia) {
      throw new NotFoundException(
        `Provinca con ID ${dto.provinciaId} no encontrada`,
      );
    }

    return this.repository.create(dto, provincia);
  }

  async update(id: number, dto: UpdateLocalidadDto) {
    this.logger.log(`Actualizando service ${this.ENTITY_NAME} con ID: ${id}`);

    const provinciaId = dto.provinciaId;
    if (provinciaId === undefined) {
      throw new Error('Provincia ID is required');
    }

    const provincia = await this.provinciaService.findOne(provinciaId);
    if (!provincia) {
      throw new NotFoundException(
        `Super Linea con ID ${dto.provinciaId} no encontrada`,
      );
    }

    await this.findEntityById(id); // Verifica existencia
    if (dto.denominacion)
      await this.checkDenominacionExists(dto.denominacion, id);
    this.logger.log(`Actualizando service2 ${this.ENTITY_NAME} con ID: ${id}`);
    return this.repository.update(id, dto, provincia);
  }

  async findAllFor(): Promise<ListadoConTotalDto<LocalidadDto>> {
    const localidades = await this.repository.findAllFor();
    const data = localidades.map((localidad) =>
      LocalidadMapper.toDto(localidad),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findAllForProvincia(
    provinciaId,
  ): Promise<ListadoConTotalDto<LocalidadDto>> {
    const localidades = await this.repository.findAllForProvincia(provinciaId);
    const data = localidades.map((localidad) =>
      LocalidadMapper.toDto(localidad),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findBy(
    denominacion: string,
    provinciaId: number,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: LocalidadDto[]; total: number }> {
    const result = await this.repository.findBy(
      denominacion,
      provinciaId,
      skip,
      take,
      incluirEliminados,
    );
    const data: LocalidadDto[] = result.data.map((localidad) =>
      LocalidadMapper.toDto(localidad),
    );
    return {
      data,
      total: PaginacionUtils.totalItems(result.total),
    };
  }

  async findDtoById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return LocalidadMapper.toDto(entity);
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
    return this.repository.remove(id);
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

  async findAllProvincia(): Promise<ListadoConTotalDto<ProvinciaDto>> {
    return this.provinciaService.findAllFor();
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

  async findAllListado(): Promise<Localidad[]> {
    const result = await this.repository.findAllListado();
    return result;
  }


}
