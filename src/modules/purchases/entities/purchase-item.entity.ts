import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Purchase } from './purchase.entity';
import { Product } from '../../inventory/entities/product.entity';

@Entity('purchase_items')
export class PurchaseItem extends BaseEntity {
    @Column('numeric', { precision: 12, scale: 3, default: 0 })
    quantity: number;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    costPrice: number;

    @ManyToOne(() => Purchase, (purchase) => purchase.items, { onDelete: 'CASCADE' })
    purchase: Purchase;

    @ManyToOne(() => Product, { eager: true })
    product: Product;
}
