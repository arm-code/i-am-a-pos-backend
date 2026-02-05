import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Product } from './product.entity';

@Entity('inventory_adjustments')
export class InventoryAdjustment extends BaseEntity {
    @ManyToOne(() => Product, { nullable: false })
    product: Product;

    @Column('numeric', { precision: 12, scale: 3 })
    quantity: number; // Positive for additions, negative for reductions

    @Column('text')
    reason: string; // Merma, Error de conteo, Robo, etc.

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;
}
