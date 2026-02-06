import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from './user.entity';

@Entity('auth_roles')
export class Role extends BaseEntity {
    @Column('text', { unique: true })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
