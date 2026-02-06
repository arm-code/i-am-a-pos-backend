import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../shared/entities/base.entity';
import { CashShift } from './cash-shift.entity';

export enum ExpenseCategory {
    LUZ = 'Luz',
    RENTA = 'Renta',
    PROVEEDOR = 'Proveedor',
    RETIRO_PERSONAL = 'Retiro Personal',
    OTROS = 'Otros',
}

@Entity('pos_expenses')
export class Expense extends BaseEntity {
    @Column('text')
    description: string;

    @Column('numeric', { precision: 12, scale: 2, default: 0 })
    amount: number;

    @Column({
        type: 'enum',
        enum: ExpenseCategory,
        default: ExpenseCategory.OTROS,
    })
    category: ExpenseCategory;

    @ManyToOne(() => CashShift, (cashShift) => cashShift.expenses, { nullable: false })
    cashShift: CashShift;
}


