import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Category } from './category.entity';
import { Movement } from './movement.entity';

@Entity('products')
export class Product extends BaseEntity {
    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('text', { unique: true })
    barcode: string;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    purchasePrice: number;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    sellPrice: number;

    @Column('numeric', { precision: 12, scale: 3, default: 0 })
    stock: number;

    @Column('numeric', { precision: 12, scale: 3, default: 0 })
    minStock: number;

    @Column('text')
    unit: string; // 'unit' | 'kg' | 'g' | etc.

    @ManyToOne(() => Category, (category) => category.products, {
        onDelete: 'SET NULL',
    })
    category: Category;

    @OneToMany(() => Movement, (movement) => movement.product)
    movements: Movement[];
}
