import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Product } from './product.entity';

export enum MovementType {
    SALE = 'SALE',
    PURCHASE = 'PURCHASE',
    ADJUSTMENT = 'ADJUSTMENT',
    SEED = 'SEED',
    PAYMENT = 'PAYMENT', // For future general use
}

@Entity('movements')
export class Movement extends BaseEntity {
    @ManyToOne(() => Product, (product) => product.movements, { onDelete: 'CASCADE', nullable: true })
    product: Product;

    @Column('numeric', { precision: 10, scale: 2 })
    quantity: number;

    @Column({
        type: 'enum',
        enum: MovementType,
    })
    type: MovementType;

    @Column('text', { nullable: true })
    reason: string;
}
