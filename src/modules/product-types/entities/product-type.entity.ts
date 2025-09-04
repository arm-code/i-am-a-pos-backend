import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipos_producto')
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'boolean', default: true })
    requiereStock: boolean;

    @Column({ type: 'boolean', default: true })
    requiereVenta: boolean;

    @Column({ type: 'boolean', default: false })
    requiereRenta: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date
}
