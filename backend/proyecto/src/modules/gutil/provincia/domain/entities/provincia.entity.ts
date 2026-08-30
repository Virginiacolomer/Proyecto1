import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Localidad } from "../../../localidad/domain/entities/localidad.entity";

@Entity('provincia')
@Index(['denominacion', 'deletedAt'], { unique: true })
export class Provincia {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  denominacion: string;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @OneToMany(() => Localidad, (localidad) => localidad.provincia, { cascade: true })
  localidades: Localidad[];

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

}
