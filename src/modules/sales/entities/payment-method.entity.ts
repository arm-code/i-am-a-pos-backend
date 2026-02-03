import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Sale } from './sale.entity';

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
    @Column('text', { unique: true, nullable: true })
    key: string; // 'CASH', 'CARD', 'CREDIT'

    @Column('text')
    name: string; // 'Efectivo', 'Tarjeta', 'Crédito'

    @OneToMany(() => Sale, (sale) => sale.paymentMethod)
    sales: Sale[];
}
