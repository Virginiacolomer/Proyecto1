import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { CreateClienteDto } from '../../dto/create-cliente.dto';
import { UpdateClienteDto } from '../../dto/update-cliente.dto';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Personal } from '../../../personal/domain/entities/personal.entity';
import { Cliente } from '../entities/cliente.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';

export interface IClienteRepository {
  create(
    data: CreateClienteDto,
    categoriaIva: CondicionIva,
    ciudad: Localidad,
    personal: Personal,
    usuario: Usuario,
  ): Promise<Cliente>;

  findByIdConAuditoria(id: number): Promise<Cliente | null>;
  findOne(id: number): Promise<Cliente | null>;
  findOneWithRelations(id: number): Promise<Cliente | null>;
  findByDenominacion(denominacion: string): Promise<Cliente | null>;
  findBy(
    denominacion: string,
    condicionIvaId: number,
    incluirEliminados: boolean,
    empresaId?: number,
    conSaldo?: boolean,
    skip?: number,
    take?: number,
  ): Promise<{ data: Cliente[]; total: number }>;

  findAllByDenominacion(denominacion: string): Promise<Cliente[]>;
  findAllByDenominacionAndCodigo(denominacion: string): Promise<Cliente[]>;
  update(
    id: number,
    data: UpdateClienteDto,
    categoriaIva: CondicionIva,
    localidad: Localidad,
    personal: Personal,
    usuario: Usuario,
  ): Promise<Cliente>;

  remove(id: number, usuario: Usuario): Promise<Cliente>;
  findByCuit(cuit: string): Promise<Cliente | null>;
  findByDni(dni: string): Promise<Cliente | null>;

}
