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
import { Domicilio } from 'src/modules/gutil/domicilio/entities/domicilio.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';
import { ClienteOperacion } from 'src/modules/organizacion/cliente-operacion/entities/cliente-operacion.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';

@Index(['deletedAt', 'cuit'])
@Index(['deletedAt', 'dni'])
@Index(['deletedAt', 'codigo'])
@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  codigo?: string;

  @Index()
  @Column({ type: 'varchar', length: 400 })
  denominacion: string;

  @Column({ type: 'text', nullable: true })
  denominacionAfip?: string;

  @Index()
  @Column({ type: 'varchar', length: 11, nullable: true })
  cuit?: string | null;

  @Index()
  @Column({ type: 'varchar', length: 11, nullable: true })
  dni?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  telefono?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  celular?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mail?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  telefonoAlternativo?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailAlternativo?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sitioWeb?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactoNombre?: string | null; // persona de contacto

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactoCargo?: string | null;

  // ========== CONDICION IVA ==========
  condicionIvaId?: number;

  @ManyToOne(() => CondicionIva)
  @JoinColumn({ name: 'condicion_iva_id' })
  condicionIva: CondicionIva;

  // ========== PERSONAL / VENDEDOR ==========
  @Column({ name: 'personal_id', type: 'int', nullable: true })
  personalId?: number;

  @ManyToOne(() => Personal)
  @JoinColumn({ name: 'personal_id' })
  personal: Personal;


  // ========== DOMICILIO ==========
  @ManyToOne(() => Domicilio, (domicilio) => domicilio.clientes, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'domicilio_id' })
  domicilio: Domicilio;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

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

  @OneToMany(() => ClienteOperacion, (cli) => cli.cliente)
  clientesOperacion: ClienteOperacion[];

  @Column({ type: 'int', default: 0 })
  sistema: number;

  @Column({ name: 'ultimo_pedido', type: 'date', nullable: true })
  ultimoPedido?: Date;

  @Column({ name: 'ultimo_factura', type: 'date', nullable: true })
  ultimoFactura?: Date;

  @Column({ name: 'ultimo_recibo', type: 'date', nullable: true })
  ultimoRecibo?: Date;
}
