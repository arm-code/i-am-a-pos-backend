import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipos_producto')
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'boolean', default: true, name: 'requiere_stock' })
    requiereStock: boolean;

    @Column({ type: 'boolean', default: true, name: 'permite_venta' })
    permiteVenta: boolean;

    @Column({ type: 'boolean', default: false, name: 'permite_renta' })
    permiteRenta: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date;
}
