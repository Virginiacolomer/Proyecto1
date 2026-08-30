import { Rol } from 'src/modules/gestion-usuario/rol/domain/entities/rol.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Domicilio } from 'src/modules/gutil/domicilio/entities/domicilio.entity';
import { Cliente } from 'src/modules/organizacion/cliente/domain/entities/cliente.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('personal')
export class Personal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  denominacion: string;

  @Column({ type: 'varchar', length: 255 })
  mail: string;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @Column({ name: 'es_vendedor', default: false })
  esVendedor: boolean;

  @ManyToOne(() => Domicilio, (domicilio) => domicilio.personales, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'domicilio_id' })
  domicilio: Domicilio;

  @OneToMany(() => Cliente, (cliente) => cliente.personal)
  clientes: Cliente[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
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

  @Column({ type: 'int', default: 0 })
  sistema: number;

  @OneToOne(() => Usuario, (usuario) => usuario.personal)
  @JoinColumn({ name: 'usuario_id' })
  usuario?: Usuario;

  @Column({name: 'usuario_id'  , type: 'int',nullable: true })
  usuarioId?: number;
}
