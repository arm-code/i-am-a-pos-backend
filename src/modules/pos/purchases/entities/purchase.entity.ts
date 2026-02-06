import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../shared/entities/base.entity';
import { Supplier } from './supplier.entity';
import { PurchaseItem } from './purchase-item.entity';

@Entity('pos_purchases')
export class Purchase extends BaseEntity {
    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    totalAmount: number;

    @ManyToOne(() => Supplier, (supplier) => supplier.purchases, { nullable: false })
    supplier: Supplier;

    @OneToMany(() => PurchaseItem, (item: PurchaseItem) => item.purchase, { cascade: true })
    items: PurchaseItem[];
}


