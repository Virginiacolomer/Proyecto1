import { Provincia } from "src/modules/gutil/provincia/domain/entities/provincia.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('localidad')
export class Localidad {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  denominacion: string;
  
  @Column({ type: 'varchar', length: 255,  nullable: true  })
  codigoPostal?: string | null;

  @ManyToOne(() => Provincia, (provincia) => provincia.localidades)
  @JoinColumn({ name: 'provincia_id' })
  provincia: Provincia;

  @Column({ name: 'provincia_id', nullable: true })
  provinciaId?: number;

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

  @Column({ type: 'int', nullable: true })
  usuarioDeletedId?: number;

  @Column({ type: 'int', nullable: true })
  usuarioUpdatedId?: number;
  
  @Column({ type: 'int', default: 0 })
  sistema: number;
}
