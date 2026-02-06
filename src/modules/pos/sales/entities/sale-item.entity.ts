import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../shared/entities/base.entity';
import { Sale } from './sale.entity';
import { Product } from '../../inventory/entities/product.entity';

@Entity('pos_sale_items')
export class SaleItem extends BaseEntity {
    @Column('numeric', { precision: 12, scale: 3, default: 0 })
    quantity: number;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    price: number; // Price at the moment of sale

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    subtotal: number;

    @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
    sale: Sale;

    @ManyToOne(() => Product, { eager: true })
    product: Product;
}


