import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonalDto } from '../../dto/create-personal.dto';
import { UpdatePersonalDto } from '../../dto/update-personal.dto';
import { Personal } from '../../domain/entities/personal.entity';
import { IPersonalRepository } from '../../domain/interfaces/personal.interface';
import { PersonalSearchDto } from '../../dto/personal-search.dto';
import { PersonalMapper } from '../../mappers/personal.mapper';
import { AuditoriaMapper } from 'src/modules/gestion-sistema/auditoria/mappers/auditoria.mapper';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { PersonalDto } from '../../dto/personal.dto';

@Injectable()
export class PersonalService {

  private readonly logger = new Logger(PersonalService.name);
  constructor(
    @Inject('IPersonalRepository')
    private readonly repository: IPersonalRepository,
    private readonly usuarioService: UsuarioService,

  ) {}

  private readonly ENTITY_NAME = 'Personal';

  async create(dto: CreatePersonalDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );
    await this.checkDenominacionExists(dto.denominacion, 0);

    const usuario = await this.usuarioService.findOne(dto.usuarioCreatedId);
    const entity = await this.repository.create(dto, usuario);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      dto.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdatePersonalDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);

    await this.findEntityById(id); // Verifica existencia
    if (dto.denominacion)
      await this.checkDenominacionExists(dto.denominacion, id);

    const usuario = await this.usuarioService.findOne(dto.usuarioUpdatedId);
    const entity = await this.repository.update(id, dto, usuario);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'editada',
    );
  }

  async findBy(
    denominacion: string,
    skip = 0,
    take = 10,
    incluirEliminados = false,
  ): Promise<{ data: PersonalSearchDto[]; total: number }> {
    this.logger.log(`  Buscando o ${denominacion}  skip=${skip}, take=${take}`);
    const result = await this.repository.findBy(denominacion, skip, take, incluirEliminados);

    const data = result.data.map((personal) =>
      PersonalMapper.toSearchDto(personal),
    );

    return {
      data,
      total: result.total,
    };
  }

  async findByIdConAuditoria(id: number) {
    const entity = await this.repository.findByIdConAuditoria(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return AuditoriaMapper.mapPersonalToDto(entity);
  }

  async findDtoById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    this.logger.log(`  2`);
    return PersonalMapper.toDto(entity);
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }

  async findAllFor(
    denominacion: string,
  ): Promise<{ data: PersonalDto[]; total: number }> {
    const result = await this.repository.findAllFor(denominacion);

    const data: PersonalDto[] = result.map((personal) =>
      PersonalMapper.toDto(personal),
    );
    return {
      data,
      total: 1,
    };
  }

  async findAllVendedorByDenominacion(denominacion: string): Promise<{ data: PersonalSearchDto[]; total: number }> {
    const result = await this.repository.findAllVendedorFor(denominacion);

    const data: PersonalSearchDto[] = result.map((personal) =>
      PersonalMapper.toSearchDto(personal),
    );
     return {
      data,
      total: 1,
    };
  }

  async remove(id: number) {
    const entity = await this.findEntityById(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    await this.repository.remove(id);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'eliminada',
    );
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

   async findAllListado(): Promise<Personal[]> {
      const result = await this.repository.findAllListado();
      return result;
    }
  

}
