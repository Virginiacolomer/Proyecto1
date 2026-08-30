import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { CreateAlicuotaIvaDto } from '../../dto/create-alicuota-iva.dto';
import { AlicuotaIva } from '../entities/alicuota-iva.entity';
import { UpdateAlicuotaIvaDto } from '../../dto/update-alicuota-iva.dto';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

export interface IAlicuotaIvaRepository {
  create(data: CreateAlicuotaIvaDto): Promise<AlicuotaIva>;
  findAllFor(denominacion: string): Promise<AlicuotaIva[]>;
  findAllListado(): Promise<AlicuotaIva[]>;
  findAllSinSistemaFor(denominacion: string): Promise<AlicuotaIva[]>;
  findAllSistemaFor(denominacion: string): Promise<AlicuotaIva[]>;
  findOne(id: number): Promise<AlicuotaIva | null>;
  findByDenominacion(denominacion: string): Promise<AlicuotaIva | null>;
  findByDenominacionWith(denominacion: String): Promise<AlicuotaIva | null>;
  findBy(
    denominacion: string,
    skip: number,
    take: number,
  ): Promise<{ data: AlicuotaIva[]; total: number }>;

  findByIdConAuditoria(id: number): Promise<AuditoriaDto | null>;
  update(id: number, data: UpdateAlicuotaIvaDto): Promise<AlicuotaIva>;

  remove(data: AlicuotaIva, usuario: Usuario): Promise<AlicuotaIva>;
}
