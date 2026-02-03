import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { SaleItem } from './sale-item.entity';

export enum PaymentType {
    CASH = 'Efectivo',
    CARD = 'Tarjeta',
    CREDIT = 'Crédito',
}

@Entity('sales')
export class Sale extends BaseEntity {
    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    total: number;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    tax: number;

    @Column({
        type: 'enum',
        enum: PaymentType,
        default: PaymentType.CASH,
    })
    paymentType: PaymentType;

    @ManyToOne(() => Customer, (customer) => customer.sales, { nullable: true })
    customer: Customer;

    @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
    items: SaleItem[];
}
