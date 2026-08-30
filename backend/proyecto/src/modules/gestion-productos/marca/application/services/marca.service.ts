import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ensureNotSistemaEntity } from 'src/modules/common/utils/atrituto-sistema';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { IMarcaRepository } from '../../domain/interfaces/marca.repository.interface';
import { UpdateMarcaDto } from '../../dto/update-marca.dto';
import { CreateMarcaDto } from '../../dto/create-marca.dto';
import { MarcaDto } from '../../dto/marca.dto';
import { MarcaMapper } from '../../mappers/marca.mapper';
import { PoliticaEliminacionMarca } from '../../domain/services/politica-eliminacion-marca.service';

import { Marca } from '../../domain/entities/marca.entity';

@Injectable()
export class MarcaService {
  private readonly logger = new Logger(MarcaService.name);
  constructor(
    @Inject('IMarcaRepository')
    private readonly repository: IMarcaRepository,
    private readonly usuarioService: UsuarioService,
    private readonly validacionesService: PoliticaEliminacionMarca,
  ) {}

  private readonly ENTITY_NAME = 'Marca';

  async create(dto: CreateMarcaDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );
    await this.checkDenominacionExists(dto.denominacion, 0);
    const entity = await this.repository.create(dto);

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      dto.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdateMarcaDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    const marca = await this.findEntityById(id);
    ensureNotSistemaEntity(marca, 'Marca');

    if (dto.denominacion)
      await this.checkDenominacionExists(dto.denominacion, id);

    const entity = await this.repository.update(id, dto);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'editada',
    );
  }

  async findAllFor(
    denominacion: string,
  ): Promise<{ data: MarcaDto[]; total: number }> {
    const result = await this.repository.findAllFor(denominacion);
    const data: MarcaDto[] = result.map((marca) => MarcaMapper.toDto(marca));
    return {
      data,
      total: 1,
    };
  }

  async findAllListado(): Promise<Marca[]> {
    const result = await this.repository.findAllListado();
    return result;
  }

  async findAllSinSistemaFor(
    denominacion: string,
  ): Promise<{ data: MarcaDto[]; total: number }> {
    const result = await this.repository.findAllSinSistemaFor(denominacion);
    const data: MarcaDto[] = result.map((marca) => MarcaMapper.toDto(marca));
    return {
      data,
      total: 1,
    };
  }

  async findAllSistemaFor(
    denominacion: string,
  ): Promise<{ data: MarcaDto[]; total: number }> {
    const result = await this.repository.findAllSistemaFor(denominacion);
    const data: MarcaDto[] = result.map((marca) => MarcaMapper.toDto(marca));
    return {
      data,
      total: 1,
    };
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: MarcaDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    const result = await this.repository.findBy(denominacion, skip, take, incluirEliminados);
    const data: MarcaDto[] = result.data.map((marca) =>
      MarcaMapper.toDto(marca),
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
    return MarcaMapper.toDto(entity);
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }

  async remove(id: number, usuarioId: number) {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    }

    ensureNotSistemaEntity(entity, 'Marca');

    const tieneProductosActivos =
      await this.validacionesService.tieneProductosActivosParaMarca(id);

    if (tieneProductosActivos) {
      throw new ConflictException(
        'No se puede eliminar la marca porque está asociada a productos activos.',
      );
    }

    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
    }
    await this.repository.remove(entity, usuario);

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'eliminada',
    );
  }

  private async checkDenominacionExists(denominacion: string, id: number) {
    const exists = await this.repository.findByDenominacionWith(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(
        `${this.ENTITY_NAME} Conflicto: denominación ya está en uso: ${denominacion}`,
      );
      throw new ConflictException('Denominación ya en uso.');
    }
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

  async findByDenominacionFiltered(findByDenominacionFiltered: any) {
    throw new Error('Method not implemented.');
  }
}
