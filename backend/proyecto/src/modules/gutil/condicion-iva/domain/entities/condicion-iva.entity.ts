import { Cliente } from 'src/modules/organizacion/cliente/domain/entities/cliente.entity';
import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('condicion_iva')
@Index(['denominacion', 'deletedAt'], { unique: true })
export class CondicionIva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255,})
  denominacion: string;

  @Column({ type: 'text' })
  letra: string;

  @Column({ type: 'int' })
  tipoCondicionIvaReceptor: number;
  
  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @Column({ type: 'boolean', default: false })
  requiereCuit: boolean;

  @Column({ type: 'boolean', default: false })
  requiereDocumento: boolean;

  @OneToMany(() => Cliente, (cliente) => cliente.condicionIva)
  clientes: Cliente[];

  @OneToMany(() => Proveedor, (proveedor) => proveedor.condicionIva, {
    cascade: true,
  })
  proveedores: Proveedor[];

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
