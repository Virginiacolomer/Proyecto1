import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { Producto } from '../../../producto/domain/entities/producto.entity';
import { SuperLinea } from '../../../superlinea/domain/entities/super-linea.entity';
import { CantidadColumn } from 'src/modules/common/decorators/cantidad-column.decorator';

@Entity('linea')
@Index(['denominacion', 'deletedAt'], { unique: true })
export class Linea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  denominacion: string;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @ManyToOne(() => SuperLinea, (superlinea) => superlinea.lineas)
  @JoinColumn({ name: 'super_linea_id' })
  superlinea: SuperLinea;

  @Column({ type: 'int', name: 'super_linea_id', nullable: false })
  superLineaId: number;

  @OneToMany(() => Producto, (producto) => producto.linea)
  productos: Producto[];
 
  @Column('boolean', { default: false })
  utilizaStockMinimo: boolean;

  @CantidadColumn()
  stockMinimo: number;

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
