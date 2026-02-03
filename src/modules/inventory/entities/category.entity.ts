import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Product } from './product.entity';

@Entity('categories')
export class Category extends BaseEntity {
    @Column('text', { unique: true })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
