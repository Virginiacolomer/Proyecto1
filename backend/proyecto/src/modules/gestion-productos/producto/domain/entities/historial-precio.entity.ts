import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from './producto.entity';
import { MonetarioColumn } from 'src/modules/common/decorators/monetario-column.decorator';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { TipoAjustePrecio } from '../../../cambio-precios/domain/enums/tipo-ajuste-precio.enum';

@Entity('historial_precio')
export class HistorialPrecio {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  // ========== PRODUCTO ==========
  @ManyToOne(() => Producto, (producto) => producto.historialPrecios, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'producto_id' })
  @Index()
  producto: Producto;

  @MonetarioColumn()
  precioAnterior: number;

  @MonetarioColumn()
  precioNuevo: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ type: 'text' })
  motivo: string;

  // ========== CR-006: aumento masivo de precios ==========
  // Columnas opcionales: los cambios de precio individuales (HU-007) las
  // dejan en null; solo las completa el aumento masivo.

  // Agrupa todos los registros generados por una misma corrida masiva.
  @Column({ name: 'lote_id', type: 'varchar', length: 36, nullable: true })
  @Index()
  loteId?: string | null;

  @Column({ type: 'enum', enum: TipoAjustePrecio, nullable: true })
  tipoAjuste?: TipoAjustePrecio | null;

  // Porcentaje o monto fijo que se aplicó (según tipoAjuste).
  @Column('decimal', {
    precision: 15,
    scale: 5,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value?.toString() ?? null,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  valorAplicado?: number | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_created_id' })
  usuarioCreated?: Usuario | null;

  @Column({ name: 'usuario_created_id', type: 'int', nullable: true })
  usuarioCreatedId?: number | null;
}
