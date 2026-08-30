import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "../../producto/domain/entities/producto.entity";

@Entity('producto_operacion')
export class ProductoOperacion {


      @PrimaryGeneratedColumn()
      id: number;
    
      @ManyToOne(() => Producto, (pro) => pro.productosOperacion, { eager: true })
      producto: Producto;
    
      @Column()
      operacionId: number;
    
      @Column()
      tipoOperacion: string; // Ej: 'compra-producto', 'venta-servicio', etc.
    
      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      creadoEn: Date;


}
