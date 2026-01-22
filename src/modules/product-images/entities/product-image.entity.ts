import { Product } from '../../../modules/products/entities/product.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('imagenes_producto')
@Index('idX_producto_id', ['producto'])
@Index('idx_principal_por_producto', ['producto', 'principal'])
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ name: 'archivo', type: 'text' })
  filename: string;

  @Column({ name: 'mime', type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'int'})
  sizeBytes: number

  // para ver si es la imagen principal del producto
  @Column({ name: 'principal', type: 'boolean', default: false })
  principal: boolean

  @ManyToOne( () => Product, (p) => p.imagenes, {onDelete: 'CASCADE'})
  @JoinColumn( { name: 'producto_id' })
  producto: Product

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
