import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { CreatePersonalDto } from '../../dto/create-personal.dto';
import { UpdatePersonalDto } from '../../dto/update-personal.dto';
import { Personal } from '../entities/personal.entity';

export interface IPersonalRepository {
  create(data: CreatePersonalDto, usuario: Usuario): Promise<Personal>;
  findOne(id: number): Promise<Personal | null>;
  findByIdConAuditoria(id: number): Promise<Personal | null>;
  findByDenominacion(denominacion: string): Promise<Personal | null>;
  findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean,
  ): Promise<{ data: Personal[]; total: number }>;
  findAllFor(denominacion: string): Promise<Personal[]>;
  findAllVendedorFor(denominacion: string): Promise<Personal[]>;
  findAllListado(): Promise<Personal[]>;
  update(
    id: number,
    data: UpdatePersonalDto,
    usuario: Usuario,
  ): Promise<Personal>;

  remove(id: number): Promise<Personal>;
}
