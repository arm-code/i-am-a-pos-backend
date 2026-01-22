import { ApiProperty } from '@nestjs/swagger';

import { Column, Entity, OneToOne } from 'typeorm';
import { Sale } from './sale.entity';
import { Rental } from './rental.entity';
import { BaseEntity } from '../../shared/base.entity';
import { TransactionType } from '../types/transactions.types';
import { TransactionStatus } from '../types/transactions-status.types';

// definimos algunos types



@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 20,
  })
  @ApiProperty({
    description: 'Tipo de transaccion',
    enum: ['income', 'expense', 'sale', 'rental'],
  })
  type: TransactionType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  @ApiProperty({
    description: 'Monto de la transaccion',
    example: 1500.59,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 3,
    default: 'MXN',
  })
  @ApiProperty({
    description: 'Moneda de la transaccion',
    example: 'MXN',
  })
  currency: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    description: 'Descripcion de la transaccion',
    required: false,
    example: 'Venta de productos electronicos',
  })
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'Fecha y hora de la transaccion',
  })
  transaction_date: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'completed',
  })
  @ApiProperty({
    description: 'Estado de la transaccion',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed',
  })
  status: TransactionStatus;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @ApiProperty({
    description: 'Tipo de negocio (para filtros)',
    required: false,
    example: 'retail',
  })
  business_type: string;

  // Relaciones con otras tablas
  @OneToOne(() => Sale, (sale) => sale.transaction)
  sale: Sale;

  @OneToOne(() => Rental, (rental) => rental.transaction)
  rental: Rental;
}
