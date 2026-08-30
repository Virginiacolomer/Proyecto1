import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Empresa } from '../../../../organizacion/empresa/domain/entities/empresa.entity';
import { MonetarioColumn } from 'src/modules/common/decorators/monetario-column.decorator';
import { PorcentajeColumn } from 'src/modules/common/decorators/porcentaje-column.decorator';

@Entity('configuracion_sistema')
export class ConfiguracionSistema {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.empresasOperacion, {
    eager: true,
  })
  empresa: Empresa;

  @Column({ type: 'int', default: 0 })
  caracteresParaBusqueda: number;

  /**
   * Mutli empresa
   */
  @Column({ type: 'boolean', default: false })
  multiEmpresa: boolean;

  /**
   * Libro Caja Unico: por empresa
   */
  @Column({ type: 'boolean', default: false })
  libroCajaUnico: boolean;

  /**
   * Libro Caja: dias maximos por libro
   */
  @Column({ type: 'int', default: 15 })
  diasMaximosLibroCaja: number;

  /**
   * Cartera de cheque Unico: por empresa
   */
  @Column({ type: 'boolean', default: false })
  carteraChequeUnico: boolean;

  @Column({ type: 'boolean', default: false })
  ocultarTotalesDocumento: boolean;

  @Column({ type: 'boolean', default: false })
  visibleSubTotalNoGravado: boolean;

  @Column({ type: 'boolean', default: false })
  visibleSubTotal: boolean;

  @Column({ type: 'boolean', default: false })
  visibleIva105: boolean;

  @Column({ type: 'boolean', default: false })
  visibleIva21: boolean;

  @Column({ type: 'int', default: 10 })
  take: number;

  /*
   *Si es true cuando abre una pantalla de busqueda hace la consulta
   */
  @Column({ type: 'boolean', default: false })
  busquedaInicial: boolean;

  @MonetarioColumn()
  maximoDolar: number;

  @Column({ type: 'int', default: 0 })
  maxDigitosPorcentajePrecio: number;

  @Column({ type: 'int', default: 0 })
  maxDigitosPorcentajePrecioMayorista: number;

  @Column({ type: 'int', default: 0 })
  maxDigitosPrecio: number;

  /*
 Emesion nde cheques
 */
  /** Años máximos hacia atrás permitidos para la fecha de emisión */

  @Column({ type: 'int', default: 2 })
  aniosEmisionMaximoAtras: number;

  /** Años máximos hacia adelante permitidos para la fecha de vencimiento */
  @Column({ type: 'int', default: 5 })
  aniosVencimientoMaximoAdelante: number;

  /**
   * Opciones producto
   *
   */
  @Column({ type: 'boolean', default: false })
  unidadMedida: boolean;

  @Column({ type: 'boolean', default: false })
  estadisticasProducto: boolean;

  @PorcentajeColumn()
  porcentajeAumento: number; // Ej:a 8%

  @Column({ type: 'boolean', default: false })
  precioConIvaVisible: boolean;

  @Column({ type: 'boolean', default: false })
  precioOferta: boolean;

  @Column({ type: 'boolean', default: false })
  costoDolar: boolean;

  @Column({ type: 'boolean', default: false })
  facturaElectronica: boolean;

  /**
   * Opociones cliente
   *
   */

  @Column({ type: 'boolean', default: false })
  clientePoseePersonal: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ type: 'int', nullable: true })
  usuarioCreatedId?: number;

  @Column({ type: 'int', nullable: true })
  usuarioDeletedId?: number;

  @Column({ type: 'int', nullable: true })
  usuarioUpdatedId?: number;

  @Column({ type: 'int', default: 0 })
  sistema: number;
}
