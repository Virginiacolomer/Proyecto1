import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { CreateLocalidadDto } from '../../dto/create-localidad.dto';
import { UpdateLocalidadDto } from '../../dto/update-localidad.dto';
import { Localidad } from '../entities/localidad.entity';
import { Provincia } from 'src/modules/gutil/provincia/domain/entities/provincia.entity';

export interface ILocalidadRepository {
  create(data: CreateLocalidadDto, provincia: Provincia): Promise<Localidad>;
  findAllFor(): Promise<Localidad[]>;
  findAllForProvincia(provinciaId: number): Promise<Localidad[]>;
  findOne(id: number): Promise<Localidad | null>;
  findByDenominacion(denominacion: string): Promise<Localidad | null>;
  findBy(
    denominacion: string,
    provinviaId: number,
    skip: number,
    take: number,
    incluirEliminados: boolean,
  ): Promise<{ data: Localidad[]; total: number }>;
  findByIdConAuditoria(id: number): Promise<AuditoriaDto | null>;
  update(
    id: number,
    data: UpdateLocalidadDto,
    provincia: Provincia,
  ): Promise<Localidad>;
  remove(id: number): Promise<Localidad>;
  findAllListado(): Promise<Localidad[]>;
}
