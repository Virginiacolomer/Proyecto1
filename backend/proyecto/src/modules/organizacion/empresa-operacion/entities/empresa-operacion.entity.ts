import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empresa } from "../../empresa/domain/entities/empresa.entity";

@Entity('empresar_operacion')
export class EmpresaOperacion {

    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Empresa, (empresa) => empresa.empresasOperacion, { eager: true })
    empresa: Empresa;
    
    @Column()
    operacionId: number;
  
    @Column()
    tipoOperacion: string; // Ej: 'compra-producto', 'venta-servicio', etc.
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creadoEn: Date;
}


