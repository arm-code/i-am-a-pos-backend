import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Purchase } from './purchase.entity';

@Entity('suppliers')
export class Supplier extends BaseEntity {
    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    phone: string;

    @OneToMany(() => Purchase, (purchase: Purchase) => purchase.supplier)
    purchases: Purchase[];
}
