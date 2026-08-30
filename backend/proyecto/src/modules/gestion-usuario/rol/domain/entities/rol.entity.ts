
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  denominacion: string;

  @Column({ type: 'text', nullable: true })
  observacion?: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ type: 'int',nullable: true})
  usuarioCreatedId?: number;
  
  @Column({ type: 'int',nullable: true})
  usuarioDeletedId?: number;

  @Column({ type: 'int',nullable: true})
  usuarioUpdatedId?: number;


}


