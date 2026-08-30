import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { ProveedorOperacion } from '../../../proveedor-operacion/entities/proveedor-operacion.entity';
import { Domicilio } from 'src/modules/gutil/domicilio/entities/domicilio.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';
@Index(['deletedAt', 'cuit'])
@Index(['deletedAt', 'codigoProveedor'])
@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  codigoProveedor: string;

  @Column({ type: 'varchar', length: 400 })
  denominacion: string;

  @Column({ type: 'text', nullable: true })
  denominacionAfip?: string;

  @Index()
  @Column({ type: 'varchar', length: 11, nullable: true })
  cuit?: string | null;

  @ManyToOne(() => Domicilio, (domicilio) => domicilio.proveedores, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'domicilio_id' })
  domicilio: Domicilio;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  // ========== CONDICION IVA ==========
  @Column({ name: 'condicion_iva_id', type: 'int', nullable: true })
  condicionIvaId?: number;

  @ManyToOne(() => CondicionIva)
  @JoinColumn({ name: 'condicion_iva_id' })
  condicionIva: CondicionIva;

  @Column('boolean', { default: false })
  esProveedorMateriaPrima: boolean;
  
  @Column('boolean', { default: false })
  esProveedorGastos: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
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

  @OneToMany(() => ProveedorOperacion, (prov) => prov.proveedor)
  proveedoresOperacion: ProveedorOperacion[];

  @Column({ type: 'int', default: 0 })
  sistema: number;
}
