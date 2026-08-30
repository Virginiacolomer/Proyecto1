import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAlicuotaIvaDto } from '../../dto/create-alicuota-iva.dto';
import { UpdateAlicuotaIvaDto } from '../../dto/update-alicuota-iva.dto';
import { IAlicuotaIvaRepository } from '../../domain/interfaces/alicuota-iva.repository.interface';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { AlicuotaIvaDto } from '../../dto/alicuota-iva.dto';
import { AlicuotaIvaMapper } from '../../mappers/alicuota-iva.mapper';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { ensureNotSistemaEntity } from 'src/modules/common/utils/atrituto-sistema';


@Injectable()
export class AlicuotaIvaService {

  private readonly logger = new Logger(AlicuotaIvaService.name);
  constructor(
    @Inject('IAlicuotaIvaRepository')
    private readonly repository: IAlicuotaIvaRepository,
    private readonly usuarioService: UsuarioService,
   
  ) {}

  private readonly ENTITY_NAME = 'AlicuotaIva';

  async create(dto: CreateAlicuotaIvaDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );
    await this.checkDenominacionExists(dto.denominacion, 0);
    this.logger.log(
      `Creando 2vo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );
    const entity = await this.repository.create(dto);
    //return MarcaMapper.toDto(entity);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      dto.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdateAlicuotaIvaDto) {
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
  ): Promise<{ data: AlicuotaIvaDto[]; total: number }> {
    const result = await this.repository.findAllFor(denominacion);
    const data: AlicuotaIvaDto[] = result.map((alicuota) =>
      AlicuotaIvaMapper.toDto(alicuota),
    );
    return {
      data,
      total: 1,
    };
  }

  

 
  async findAllSinSistemaFor(
    denominacion: string,
  ): Promise<{ data: AlicuotaIvaDto[]; total: number }> {
    const result = await this.repository.findAllSinSistemaFor(denominacion);
    const data: AlicuotaIvaDto[] = result.map((marca) =>
      AlicuotaIvaMapper.toDto(marca),
    );
    return {
      data,
      total: 1,
    };
  }

  async findAllSistemaFor(
    denominacion: string,
  ): Promise<{ data: AlicuotaIvaDto[]; total: number }> {
    const result = await this.repository.findAllSistemaFor(denominacion);
    const data: AlicuotaIvaDto[] = result.map((marca) =>
      AlicuotaIvaMapper.toDto(marca),
    );
    return {
      data,
      total: 1,
    };
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: AlicuotaIvaDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    const result = await this.repository.findBy(denominacion, skip, take);
    const data: AlicuotaIvaDto[] = result.data.map((marca) =>
      AlicuotaIvaMapper.toDto(marca),
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
    return AlicuotaIvaMapper.toDto(entity);
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


}
