
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Localidad } from "../../localidad/domain/entities/localidad.entity";
import { Personal } from "src/modules/organizacion/personal/domain/entities/personal.entity";
import { Cliente } from "src/modules/organizacion/cliente/domain/entities/cliente.entity";
import { Proveedor } from "src/modules/organizacion/proveedor/domain/entities/proveedor.entity";

@Entity('domicilio')
export class Domicilio {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    direccion?: string;

    @ManyToOne(() => Localidad, { nullable: true })
    @JoinColumn({ name: 'localidad_id' })
    localidad: Localidad;

    @CreateDateColumn()
    createdAt: Date;
   
    @UpdateDateColumn()
    updatedAt: Date;
    
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
    

    @Column({ type: 'int',nullable: true})
    usuarioCreatedId?: number;

    @Column({ type: 'int',nullable: true})
    usuarioUpdatedId?: number;

    @Column({ type: 'int',nullable: true})
    usuarioDeletedId?: number;

    @OneToMany(() => Cliente, (cliente) =>  cliente.domicilio ) 
    clientes: Cliente[]

    @OneToMany(() => Proveedor, (proveedor) =>  proveedor.domicilio ) 
    proveedores: Proveedor[]
    
    @OneToMany(() => Personal, (personal) =>  personal.domicilio ) 
    personales: Personal[]
}
