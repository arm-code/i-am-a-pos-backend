import { BaseEntity } from '../../../shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SaleNote } from './sale-note.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('sale_note_items')
export class SaleNoteItem extends BaseEntity {
    @Column()
    @ApiProperty({
        description: 'ID de la nota de venta a la que pertenece',
    })
    sale_note_id: number;

    @Column({ nullable: true })
    @ApiProperty({
        description: 'ID del producto (si es un producto registrado)',
        required: false,
    })
    product_id: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({
        description: 'Cantidad',
        example: 2,
    })
    quantity: number;

    @Column({ type: 'text' })
    @ApiProperty({
        description: 'Descripción del servicio o producto',
        example: 'Servicio de mantenimiento preventivo',
    })
    description: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    @ApiProperty({
        description: 'Precio unitario',
        example: 500.00,
    })
    unit_price: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    @ApiProperty({
        description: 'Importe (cantidad * precio unitario)',
        example: 1000.00,
    })
    amount: number;

    // Relaciones
    @ManyToOne(() => SaleNote, (note) => note.items)
    @JoinColumn({ name: 'sale_note_id' })
    sale_note: SaleNote;

    @ManyToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
