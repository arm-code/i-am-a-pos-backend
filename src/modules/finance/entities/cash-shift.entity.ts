import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Expense } from './expense.entity';
import { Sale } from '../../sales/entities/sale.entity';

export enum CashShiftStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}

@Entity('cash_shifts')
export class CashShift extends BaseEntity {
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    initialBalance: number;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    expectedBalance: number;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    realBalance: number;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    difference: number;

    @Column({
        type: 'enum',
        enum: CashShiftStatus,
        default: CashShiftStatus.OPEN,
    })
    status: CashShiftStatus;

    @OneToMany(() => Expense, (expense) => expense.cashShift)
    expenses: Expense[];

    @OneToMany(() => Sale, (sale) => sale.cashShift)
    sales: Sale[];
}
