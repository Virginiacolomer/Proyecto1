import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from '../../../producto/domain/entities/producto.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { MonetarioColumn } from 'src/modules/common/decorators/monetario-column.decorator';
import { TipoAjustePrecio } from '../enums/tipo-ajuste-precio.enum';

/**
 * Entidad satélite del agregado Producto (Decisión de diseño #6 de la HU CR-006):
 * cada fila registra un cambio de precio puntual, para no perder el "por qué"
 * cuando `producto.precio` se pisa con un valor nuevo.
 */
@Entity('historial_precio')
export class HistorialPrecio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ name: 'producto_id', type: 'int' })
  @Index()
  productoId: number;

  // Agrupa todas las filas generadas por una misma corrida de aumento masivo
  // (Decisión de diseño #7). También queda null en cambios individuales.
  @Column({ name: 'lote_id', type: 'varchar', length: 36, nullable: true })
  @Index()
  loteId?: string | null;

  @MonetarioColumn()
  precioAnterior: number;

  @MonetarioColumn()
  precioNuevo: number;

  @Column({ type: 'enum', enum: TipoAjustePrecio })
  tipoAjuste: TipoAjustePrecio;

  @MonetarioColumn()
  valorAplicado: number;

  // Obligatorio (Decisión de diseño #8): mismo criterio que "motivo" en un
  // ajuste de stock.
  @Column({ type: 'text' })
  motivo: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_created_id' })
  usuarioCreated: Usuario;

  @Column({ name: 'usuario_created_id', type: 'int' })
  usuarioCreatedId: number;

  @CreateDateColumn()
  createdAt: Date;
}
