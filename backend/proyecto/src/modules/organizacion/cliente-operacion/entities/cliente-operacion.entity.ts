import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../cliente/domain/entities/cliente.entity';

@Entity('cliente_operacion')
export class ClienteOperacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, (cli) => cli.clientesOperacion, { eager: true })
  cliente: Cliente;

  @Column()
  operacionId: number;

  @Column()
  tipoOperacion: string; // Ej: 'compra-producto', 'venta-servicio', etc.

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn: Date;
}
