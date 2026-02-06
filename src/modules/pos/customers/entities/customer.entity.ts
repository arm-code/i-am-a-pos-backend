import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../shared/entities/base.entity';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('pos_customers')
export class Customer extends BaseEntity {
    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    phone: string;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    balance: number; // Positive means they owe money

    @OneToMany(() => Sale, (sale) => sale.customer)
    sales: Sale[];
}


