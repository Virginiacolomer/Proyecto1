import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { UpdatePresentacionDto } from '../../dto/update-presentacion.dto';
import { Presentacion } from '../entities/presentacion.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';

export interface IPresentacionRepository {
  create(data: CreatePresentacionDto): Promise<Presentacion>;
  findAllFor(denominacion: string): Promise<Presentacion[]>;
  findAllListado(): Promise<Presentacion[]>;
  findAllSinSistemaFor(denominacion: string): Promise<Presentacion[]>;
  findAllSistemaFor(denominacion: string): Promise<Presentacion[]>;
  findOne(id: number): Promise<Presentacion | null>;
  findByDenominacion(denominacion: string): Promise<Presentacion | null>;
  findByDenominacionWith(denominacion: String): Promise<Presentacion | null>;
  findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean
  ): Promise<{ data: Presentacion[]; total: number } >;

  findByIdConAuditoria(id: number):  Promise<AuditoriaDto | null> ;
  update(id: number, data: UpdatePresentacionDto): Promise<Presentacion>;

  remove(data: Presentacion, usuario: Usuario): Promise<Presentacion>;
}
