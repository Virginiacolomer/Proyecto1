import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmpresaOperacion } from '../../../empresa-operacion/entities/empresa-operacion.entity';
import { CondicionIva } from 'src/modules/gutil/condicion-iva/domain/entities/condicion-iva.entity';

@Entity('empresa')
export class Empresa {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  denominacion: string;
  
  @Column({ type: 'varchar', length: 15, nullable: true })
  cuit?: string | null;

  @ManyToOne(() => CondicionIva, (condicionIva) => condicionIva.clientes, {
    cascade: true,
  })
  @JoinColumn({ name: 'condicion_iva_id' })
  condicionIva: CondicionIva;

  @Column({ type: 'text', nullable: true })
  domicilio?: string;

  @Column({ type: 'text', nullable: true })
  telefono?: string;

  @Column({ type: 'text', nullable: true })
  email?: string;
   
  @Column({ type: 'text', nullable: true })
  fechaInicioActividad?: string;

  @Column({ type: 'text', nullable: true })
  ingresosBrutos?: string;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

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

  @OneToMany(() => EmpresaOperacion, (emp) => emp.empresa)
  empresasOperacion: EmpresaOperacion[];

 
}
