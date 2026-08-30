import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from '../../../rol/domain/entities/rol.entity';
import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mail: string;

  @Column()
  contrasena: string;

  @Column()
  denominacion: string;

  @Column({ default: true })
  activo: boolean;

  // ROLES DE SEGURIDAD (MUY IMPORTANTE)
  @ManyToMany(() => Rol)
  @JoinTable({
    name: 'usuarioRol',
    joinColumn: {
      name: 'usuarioId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rolId',
      referencedColumnName: 'id',
    },
  })
  roles: Rol[];

  @OneToOne(() => Personal, (personal) => personal.usuario)
  @JoinColumn({ name: 'personal_id' })
  personal?: Personal;

  @Column({name: 'personal_id', type: 'int', nullable: true })
  personalId?: number;

  @Column({ nullable: true })
  codigoRecuperacion: string;

  @Column({ nullable: true, type: 'timestamp' })
  codigoExpira: Date;

  // auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'int', nullable: true })
  usuarioCreatedId?: number;

  @Column({ type: 'int', nullable: true })
  usuarioDeletedId?: number;

  @Column({ type: 'int', nullable: true })
  usuarioUpdatedId?: number;
}
