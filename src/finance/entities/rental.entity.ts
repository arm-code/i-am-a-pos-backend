// src/finance/entities/rental.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export type RentalStatus = 'active' | 'completed' | 'cancelled' | 'overdue';

@Entity('rentals')
export class Rental extends Base {
  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'ID de la transacción asociada' })
  transaction_id: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'ID del cliente', required: false })
  customer_id: string;

  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'ID del producto rentado' })
  product_id: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: 'Fecha de inicio de la renta' })
  rental_start: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: 'Fecha de fin de la renta' })
  rental_end: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Monto total de la renta', example: 1200.00 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  @ApiProperty({ description: 'Monto del depósito', example: 500.00, default: 0 })
  deposit_amount: number;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  @ApiProperty({ 
    description: 'Estado de la renta',
    enum: ['active', 'completed', 'cancelled', 'overdue'],
    default: 'active'
  })
  status: RentalStatus;

  // Relaciones
  @OneToOne(() => Transaction, transaction => transaction.rental)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}