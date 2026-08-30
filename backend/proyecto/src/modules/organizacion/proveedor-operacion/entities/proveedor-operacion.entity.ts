import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Proveedor } from '../../proveedor/domain/entities/proveedor.entity';

@Entity('proveedor_operacion')
export class ProveedorOperacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proveedor, (pro) => pro.proveedoresOperacion, {
    eager: true,
  })
  proveedor: Proveedor;

  @Column()
  operacionId: number;

  @Column()
  tipoOperacion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn: Date;
}
