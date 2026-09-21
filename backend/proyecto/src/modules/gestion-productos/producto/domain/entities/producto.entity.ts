import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ProductoInvalidoException } from '../exceptions/producto-invalido.exception';
import { redondear5 } from 'src/modules/common/utils/number/redondeo';
import { Linea } from '../../../linea/domain/entities/linea.entity';
import { Marca } from '../../../marca/domain/entities/marca.entity';
import { Presentacion } from '../../../presentacion/domain/entities/presentacion.entity';
import { AlicuotaIva } from 'src/modules/organizacion/enums/alicuota-iva.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ProductoOperacion } from '../../../producto-operacion/entities/producto-operacion.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { MonetarioColumn } from 'src/modules/common/decorators/monetario-column.decorator';
import { CantidadColumn } from 'src/modules/common/decorators/cantidad-column.decorator';
import { PorcentajeColumn } from 'src/modules/common/decorators/porcentaje-column.decorator';
import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';
import { TipoAjustePrecio } from '../../../cambio-precios/domain/enums/tipo-ajuste-precio.enum';
import { OneToMany } from 'typeorm';
import { HistorialPrecio } from './historial-precio.entity';

@Entity('producto')
export class Producto {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  denominacion: string;

  @ApiProperty({ description: 'Presentación del producto' })
  @ManyToOne(() => Presentacion, (presentacion) => presentacion.productos)
  @JoinColumn({ name: 'presentacion_id' })
  presentacion: Presentacion;

  @Column({ type: 'int', nullable: true })
  presentacionId?: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  codigoProveedor?: string | null;

  @Column({ type: 'text', nullable: true })
  codigoBarra?: string | null;

  // ========== PROVEEDOR ==========
  @ManyToOne(() => Proveedor, (pro) => pro.proveedoresOperacion, {
    eager: true,
  })
  @JoinColumn({ name: 'proveedor_id' })
  @Index()
  proveedor: Proveedor;

  @Column({ type: 'int', nullable: true })
  proveedorId?: number;

  /*
  Nota: No usar el enum alciculta iva en @Column
        sino no anda el importar precios 
  */
  @PorcentajeColumn(21.0)
  alicuotaIva: AlicuotaIva;

  // Stock: cantidades reales, admite fracciones (1.5 kg, 0.25 lts)
  @CantidadColumn()
  stock: number;

  @Column('boolean', { default: false })
  utilizaStockMinimo: boolean;

  @Column('boolean', { default: false })
  utilizaStockMinimoPorEmpresa: boolean;

  @CantidadColumn()
  stockMinimo: number;

  @MonetarioColumn()
  costo?: number;

  @MonetarioColumn()
  costoDolar?: number;

  /*
  Ultima cotizacion dolar por el cambio de precio si producto posee costo dolar
  */
  @MonetarioColumn()
  cotizacionDolar?: number;
  //se utiliza en las importaciones;

  @MonetarioColumn()
  precioDolar?: number;
  // Precio de venta

  @MonetarioColumn()
  precio?: number;

  @PorcentajeColumn()
  porcentaje?: number;

  @Column({ type: 'timestamp', nullable: true })
  fechaCosto?: Date;

  @Column('boolean', { default: false })
  costoEnDolar?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaCostoDolar?: Date;


  @Column('boolean', { default: false })
  destacado?: boolean;

  @Column('boolean', { default: false })
  envioGratis?: boolean;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  deletedAt?: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_created_id' })
  usuarioCreated: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_updated_id' })
  usuarioUpdated: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_deleted_id' })
  usuarioDeleted: Usuario;


  // ========== LINEA ==========
  @ManyToOne(() => Linea, (linea) => linea.productos)
  @JoinColumn({ name: 'linea_id' })
  linea: Linea;

  @Column({ type: 'int', nullable: true })
  lineaId?: number;


 // ==========  MARCA ==========
  @ManyToOne(() => Marca, (marca) => marca.productos)
  @JoinColumn({ name: 'marca_id' })
  marca: Marca;

  @Column({ type: 'int', nullable: true })
  marcaId?: number;


  @Column({ default: false })
  utilizaPack: boolean;

  @Column({ type: 'int', nullable: true })
  cantidadPorPack: number | null;

  @Column({ type: 'text', nullable: true })
  imagen?: string;


  @Column({ type: 'text', nullable: true })
  ubicacion?: string;

  @ManyToOne(() => Producto, (producto) => producto.productosOperacion)
  productosOperacion: ProductoOperacion;

  // ========== HISTORIAL DE PRECIOS ==========
  @OneToMany(() => HistorialPrecio, (historial) => historial.producto)
  historialPrecios: HistorialPrecio[];

  @Column({ type: 'int', default: 0 })
  sistema: number;

  @Column({ type: 'text', nullable: true })
  codigoReferencia?: string | null;

  /**
   * Valida y aplica costo, margen y stock según las reglas de negocio.
   * Se ejecuta en el dominio (no en el DTO ni en el controller) para que
   * ninguna vía de acceso (formulario, importación, otro servicio interno)
   * pueda persistir un producto inconsistente.
   *
   * Si algún dato es inválido, no modifica el estado del producto y lanza
   * ProductoInvalidoException con TODOS los errores encontrados.
   */
  establecerCostoMargenYStock(datos: {
    costo?: number;
    margen?: number;
    stock?: number;
    stockMinimo?: number;
  }): void {
    const costo = datos.costo ?? this.costo ?? 0;
    const margen = datos.margen ?? this.porcentaje ?? 0;
    const stock = datos.stock ?? this.stock ?? 0;
    const stockMinimo = datos.stockMinimo ?? this.stockMinimo ?? 0;

    const errores: string[] = [];

    if (costo <= 0) {
      errores.push('El costo debe ser mayor a cero');
    }
    if (margen < 0) {
      errores.push('El margen no puede ser negativo');
    }
    if (stock < 0) {
      errores.push('El stock actual no puede ser negativo');
    }
    if (stockMinimo < 0) {
      errores.push('El stock mínimo no puede ser negativo');
    }

    if (errores.length > 0) {
      throw new ProductoInvalidoException(errores);
    }

    this.costo = costo;
    this.porcentaje = margen;
    this.stock = stock;
    this.stockMinimo = stockMinimo;
    // El precio de venta siempre se deriva de costo + margen.
    // Nunca se acepta un valor de precio cargado externamente.
    this.precio = redondear5(costo + costo * (margen / 100));
  }

  /**
   * Calcula cuánto quedaría el precio si se aplicara un aumento por
   * porcentaje o por monto fijo, sin modificar el producto todavía.
   * Se usa tanto para la previsualización ("simular") como, internamente,
   * antes de confirmar el cambio.
   *
   * Decisión de diseño #2 (HU CR-006): el cálculo vive en la entidad,
   * no en el service que orquesta el aumento masivo.
   */
  simularAumento(tipoAjuste: TipoAjustePrecio, valor: number): number {
    const precioActual = this.precio ?? 0;

    const precioBruto =
      tipoAjuste === TipoAjustePrecio.PORCENTAJE
        ? precioActual + precioActual * (valor / 100)
        : precioActual + valor;

    const precioNuevo = Math.round(precioBruto * 100) / 100;

    if (precioNuevo <= 0) {
      throw new BadRequestException(
        `El ajuste dejaría el precio de "${this.denominacion}" en $${precioNuevo}; no puede ser cero ni negativo.`,
      );
    }

    return precioNuevo;
  }

  /**
   * Deja el precio nuevo asentado en el producto. Devuelve el precio
   * anterior para que quien orquesta el aumento masivo arme el registro
   * de HistorialPrecio (el motivo/usuario/lote no son datos del Producto).
   */
  confirmarAumento(precioNuevo: number): number {
    const precioAnterior = this.precio ?? 0;
    this.precio = precioNuevo;
    return precioAnterior;
  }
}
