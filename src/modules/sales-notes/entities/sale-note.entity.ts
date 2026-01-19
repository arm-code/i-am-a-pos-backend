import { BaseEntity } from '../../../shared/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SaleNoteItem } from './sale-note-item.entity';
import { Transaction } from '../../../finance/entities/transaction.entity';

@Entity('sale_notes')
export class SaleNote extends BaseEntity {
    @Column({ unique: true })
    @ApiProperty({
        description: 'Número de nota de venta',
        example: 'NV-0001',
    })
    note_number: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({
        description: 'Fecha de la nota de venta',
    })
    date: Date;

    @Column()
    @ApiProperty({
        description: 'Nombre del cliente',
        example: 'Juan Pérez',
    })
    client_name: string;

    @Column({ nullable: true })
    @ApiProperty({
        description: 'Teléfono del cliente',
        example: '555-1234',
        required: false,
    })
    client_phone: string;

    @Column({ type: 'text', nullable: true })
    @ApiProperty({
        description: 'Dirección del cliente',
        example: 'Av. Siempre Viva 123',
        required: false,
    })
    client_address: string;

    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
    })
    @ApiProperty({
        description: 'Subtotal de la nota',
        example: 1000.00,
    })
    subtotal: number;

    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
    })
    @ApiProperty({
        description: 'Monto de IVA',
        example: 160.00,
    })
    tax_amount: number;

    @Column({
        type: 'decimal',
        precision: 15,
        scale: 2,
    })
    @ApiProperty({
        description: 'Total de la nota',
        example: 1160.00,
    })
    total: number;

    @Column()
    @ApiProperty({
        description: 'Usuario que expidió la nota',
        example: 'admin',
    })
    issued_by: string;

    @Column({ nullable: true })
    @ApiProperty({
        description: 'ID de la transacción asociada en el módulo finance',
        required: false,
    })
    transaction_id: number | null;

    // Relaciones
    @OneToMany(() => SaleNoteItem, (item: SaleNoteItem) => item.sale_note, { cascade: true })
    items: SaleNoteItem[];

    @OneToOne(() => Transaction)
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;
}
