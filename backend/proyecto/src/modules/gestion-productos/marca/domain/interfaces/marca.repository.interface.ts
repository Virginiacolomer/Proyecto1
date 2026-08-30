import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { CreateMarcaDto } from '../../dto/create-marca.dto';
import { UpdateMarcaDto } from '../../dto/update-marca.dto';
import { Marca } from '../entities/marca.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';

export interface IMarcaRepository {
  create(data: CreateMarcaDto): Promise<Marca>;
  findAllFor(denominacion: string): Promise<Marca[]>;
  findAllListado(): Promise<Marca[]>;
  findAllSinSistemaFor(denominacion: string): Promise<Marca[]>;
  findAllSistemaFor(denominacion: string): Promise<Marca[]>;
  findOne(id: number): Promise<Marca | null>;
  findByDenominacion(denominacion: string): Promise<Marca | null>;
  findByDenominacionWith(denominacion: String): Promise<Marca | null>;
  findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean
  ): Promise<{ data: Marca[]; total: number } >;

  findByIdConAuditoria(id: number):  Promise<AuditoriaDto | null> ;
  update(id: number, data: UpdateMarcaDto): Promise<Marca>;

  remove(data: Marca, usuario: Usuario): Promise<Marca>;
}
