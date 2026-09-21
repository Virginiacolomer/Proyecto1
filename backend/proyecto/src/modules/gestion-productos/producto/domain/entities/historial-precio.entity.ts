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
}
