import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import * as bcrypt from 'bcrypt';
import { Sale } from '../../pos/sales/entities/sale.entity';
import { CashShift } from '../../pos/finance/entities/cash-shift.entity';

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    GUEST = 'GUEST',
}

@Entity('auth_users')
export class User extends BaseEntity {
    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text', { nullable: true })
    phone: string;

    @Column('text', { nullable: true })
    address: string;

    @Column('text', { nullable: true })
    avatar: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column('boolean', { default: true })
    isActive: boolean;

    @OneToMany(() => Sale, (sale) => sale.user)
    sales: Sale[];

    @OneToMany(() => CashShift, (shift) => shift.user)
    cashShifts: CashShift[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
