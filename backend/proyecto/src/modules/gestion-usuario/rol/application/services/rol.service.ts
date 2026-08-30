import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IRolRepository } from '../../domain/interfaces/rol-repository.interface';
import { CreateRolDto } from '../../dto/create-rol.dto';
import { UpdateRolDto } from '../../dto/update-rol.dto';
import { Rol } from '../../domain/entities/rol.entity';

@Injectable()
export class RolService {
  private readonly logger = new Logger(RolService.name);

  constructor(
    @Inject('IRolRepository')
    private readonly repository: IRolRepository,
  ) {}

  private readonly ENTITY_NAME = 'Rol';

  async create(dto: CreateRolDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`);
    await this.checkDenominacionExists(dto.denominacion, 0);

    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateRolDto) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);

    await this.findOne(id); // Verifica existencia
    if (dto.denominacion) await this.checkDenominacionExists(dto.denominacion, id);
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

  async findOne(id: number) {
    const entity = await this.repository.findOne(id);
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

  async findByIds(ids: number[]): Promise<Rol[]> {
  const roles = await this.repository.findByIds(ids);

  if (roles.length !== ids.length) {
    throw new NotFoundException('Uno o más roles no existen');
  }

  return roles;
}
}

