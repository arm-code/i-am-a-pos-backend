import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/modules/categories/entities/category.entity";
import { ProductImage } from "src/modules/product-images/entities/product-image.entity";
import { ProductType } from "src/modules/product-types/entities/product-type.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('productos')
@Index('idx_nombre', ['nombre'])
export class Product {

    @ApiProperty({
        description: 'Id único del producto',
        example: '1'
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Código de barras del producto',
        example: '7501031311309',
        maxLength: 50,
        nullable: true
    })
    @Column({ name: 'codigo_barras', length: 50, unique: true, nullable: true })
    codigoBarra: string;

    @ApiProperty({
        description: 'SKU (Stock Keeping Unit) del producto',
        example: 'PROD-001-2024',
        maxLength: 50,
        nullable: true
    })
    @Column({ length: 50, unique: true, nullable: true })
    sku: string;

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Laptop Dell XPS 13',
        maxLength: 200
    })
    @Column({ length: 200 })
    nombre: string;

    @ApiProperty({
        description: 'Descripción detallada del producto',
        example: 'Laptop ultradelgada con procesador Intel Core i7, 16GB RAM, 512GB SSD',
        nullable: true
    })
    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @ApiProperty({
        description: 'Precio de compra del producto',
        example: 1200.50,
        minimum: 0,
        default: 0.0
    })
    @Column('numeric', { name: 'precio_compra', precision: 10, scale: 2, default: 0.0 })
    precioCompra: number;

    @ApiProperty({
        description: 'Precio de venta al público',
        example: 1599.99,
        minimum: 0
    })
    @Column('numeric', { name: 'precio_venta', precision: 10, scale: 2 })
    precioVenta: number;

    @ApiProperty({
        description: 'Precio de renta diario del producto',
        example: 25.50,
        minimum: 0,
        default: 0.0
    })
    @Column('numeric', { name: 'precio_renta_diario', precision: 10, scale: 2, default: 0.0 })
    precioRentaDiario: number;

    @ApiProperty({
        description: 'Cantidad en inventario',
        example: 15,
        minimum: 0,
        default: 0
    })
    @Column({ type: 'int', default: 0 })
    stock: number;

    @ApiProperty({
        description: 'Stock mínimo antes de reordenar',
        example: 5,
        minimum: 0,
        default: 0
    })
    @Column({ name: 'stock_minimo', type: 'int', default: 0 })
    stockMinimo: number;

    @ApiProperty({
        description: 'Categoría del producto',
        type: () => Category,
        nullable: true
    })
    @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({ name: 'categoria_id'})
    categoria: Category | null;

    @ApiProperty({
        description: 'Tipo de producto',
        type: () => ProductType
    })
    @ManyToOne(() => ProductType, { nullable: false, onDelete: 'RESTRICT'})
    @JoinColumn({ name: 'tipo_producto_id'})
    @Index('idx_tipo_producto_id')
    tipoProducto: ProductType;    

    @ApiProperty({
        description: 'Imágenes del producto',
        type: () => [ProductImage],
        nullable: true
    })
    @OneToMany( () => ProductImage, (img) => img.producto, { cascade: true })
    imagenes?: ProductImage[]

    @ApiProperty({
        description: 'Estado activo/inactivo del producto',
        example: true,
        default: true
    })
    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @ApiProperty({
        description: 'Fecha de creación del registro',
        example: '2024-01-15T10:30:00.000Z'
    })
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date;

    @ApiProperty({
        description: 'Fecha de última actualización del registro',
        example: '2024-01-20T14:45:00.000Z'
    })
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz'})
    updatedAt: Date;
}