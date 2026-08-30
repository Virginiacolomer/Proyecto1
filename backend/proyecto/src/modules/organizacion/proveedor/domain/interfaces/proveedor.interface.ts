import { Localidad } from 'src/modules/gutil/localidad/domain/entities/localidad.entity';
import { CreateProveedorDto } from '../../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../../dto/update-proveedor.dto';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
import { Proveedor } from '../entities/proveedor.entity';

export interface IProveedorRepository {
  create(
    data: CreateProveedorDto,
    categoriaIva: CondicionIva,
    localidad: Localidad,
    usuario: Usuario,
  ): Promise<Proveedor>;
  findAllFor(denominacion: string): Promise<Proveedor[]>;
  findAllSistemaFor(denominacion: string): Promise<Proveedor[]>;

  findAllByTipo(
    denominacion: string,
    compra: boolean,
    gasto: boolean,
  ): Promise<Proveedor[]>;

  findAllSinSistemaFor(denominacion: string): Promise<Proveedor[]>;
  findOne(id: number): Promise<Proveedor | null>;
  findByIdConAuditoria(id: number): Promise<Proveedor | null>;
  findByDenominacion(denominacion: string): Promise<Proveedor | null>;
  findBy(
    denominacion: string,
    condicionIvaId: number,
    incluirEliminados: boolean,
    empresaId?: number,
    conSaldo?: boolean,
    skip?: number,
    take?: number,
  ): Promise<{ data: Proveedor[]; total: number }>;

  findAllByDenominacion(denominacion: string): Promise<Proveedor[]>;

  update(
    id: number,
    data: UpdateProveedorDto,
    categoriaIva: CondicionIva,
    localidad: Localidad,
    usuario: Usuario,
  ): Promise<Proveedor>;

  remove(id: number, usuario: Usuario): Promise<Proveedor>;

  findByCuit(cuit: string): Promise<Proveedor | null>;

 

}
