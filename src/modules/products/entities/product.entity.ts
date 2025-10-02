import { Category } from "src/modules/categories/entities/category.entity";
import { ProductType } from "src/modules/product-types/entities/product-type.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('productos')
@Index('idx_nombre', ['nombre'])
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'codigo_barras', length: 50, unique: true, nullable: true })
    codigoBarra: string;

    @Column({ length: 50, unique: true, nullable: true })
    sku: string;

    @Column({ length: 200 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column('numeric', { name: 'precio_compra', precision: 10, scale: 2, default: 0.0 })
    precioCompra: number;

    @Column('numeric', { name: 'precio_venta', precision: 10, scale: 2 })
    precioVenta: number;

    @Column('numeric', { name: 'precio_renta_diario', precision: 10, scale: 2, default: 0.0 })
    precioRentaDiario: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ name: 'stock_minimo', type: 'int', default: 0 })
    stockMinimo: number;

    @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({ name: 'categoria_id'})
    categoria: Category | null;

    @ManyToOne(() => ProductType, { nullable: false, onDelete: 'RESTRICT'})
    @JoinColumn({ name: 'tipo_producto_id'})
    @Index('idx_tipo_producto_id')
    tipoProducto: ProductType;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz'})
    updatedAt: Date;
}
