import { Linea } from '../../../linea/domain/entities/linea.entity';
import { Marca } from '../../../marca/domain/entities/marca.entity';
import { CreateProductoDto } from '../../dto/create-producto.dto';
import { Producto } from '../entities/producto.entity';
import { UpdateProductoDto } from '../../dto/update-producto.dto';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { UpdatePrecioDto } from '../../dto/update-precio.dto';
import { HistorialPrecio } from '../entities/historial-precio.entity';

export interface IProductoRepository {

  create(
    data: CreateProductoDto,
    linea: Linea,
    marca: Marca,
    usuario: Usuario,
  ): Promise<Producto>;

  findOne(id: number): Promise<Producto | null>;
  findByIdConAuditoria(id: number): Promise<Producto | null>;
  findByDenominacion(denominacion: string): Promise<Producto | null>;

  findBy(
    denominacion: string,
    codigoProveedor: string,
    codProveedorExacto: boolean,
    codigoReferencia: string,
    marca_id: number,
    linea_id: number,
    superLineaId: number,
    proveedor_id: number,
    conStock: boolean,
    skip: number,
    take: number,
  ): Promise<{ data: Producto[]; total: number }>;

  findByRapido(
    codigo: string,
    exacto: boolean,
    skip: any,
    take: number,
  ): Promise<{ data: Producto[]; total: number }>;


  findByIdWithoutRelations(id: number): Promise<Producto | null> | undefined;

  update(
    id: number,
    data: UpdateProductoDto,
    linea: Linea,
    marca: Marca,
    usuario: Usuario,
  ): Promise<Producto>;

  updateEntity(uow: IUnitOfWork, data: Producto): Promise<Producto>;

  actualizarPrecio(
    id: number,
    dto: UpdatePrecioDto,
    usuario: Usuario,
  ): Promise<void>;

  getHistorialPrecios(productoId: number): Promise<HistorialPrecio[]>;
  remove(data: Producto, usuario: Usuario): Promise<Producto>;

  isCodigoProveedorDuplicado(
    codigoProveedor: string | null,
    id?: number,
  ): Promise<boolean>;

  findByDenominacionCodigoProveedorFiltered(
    denominacion: string,
    skip: number,
    take: number,
  ): Promise<{ data: Producto[]; total: number }>;

  existsByDenominacion(
    denominacion: string,
    excludeId?: number,
  ): Promise<boolean>;
  existsByCodigoProveedor(codigoProveedor: string, excludeId: number): Promise<boolean>;
  existsProductosActivosByMarca(marcaId: number): Promise<boolean>;
  existsProductosActivosByLinea(lineaId: number): Promise<boolean>;
  existsProductosActivosByPresentacion(presentacionId: number): Promise<boolean>;

  findByIds(ids: number[]): Promise<Producto[]>;

  /**
   * Alcance para el aumento masivo de precios (Decisión de diseño #9 de la
   * HU CR-006): reusa los mismos filtros de línea/marca que ya tiene la
   * búsqueda de productos. Sin filtros, devuelve todos los productos activos.
   */
  findActivosPorLineaOMarca(
    lineaId?: number,
    marcaId?: number,
  ): Promise<Producto[]>;
}
