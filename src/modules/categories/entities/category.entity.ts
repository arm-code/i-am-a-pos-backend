import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categorias')
export class Category {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ type: 'text', nullable: true})
    descripcion: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz'})
    updatedAt: Date;
}
