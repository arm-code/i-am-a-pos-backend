import { Base } from 'src/shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Transaction } from './transaction.entity';
import { PaymentMethod } from './payment-method.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SaleItem } from './sale-item.entity';

export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

@Entity('sales')
export class Sale extends Base {
  @Column({
    type: 'uuid',
  })
  @ApiProperty({
    description: 'Id de la transaccion asociada',
  })
  transaction_id: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  @ApiProperty({
    description: 'Id del cliente',
    required: false,
  })
  customer_id: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  @ApiProperty({
    description: 'Monto total de la venta',
    example: 2500.49,
  })
  total_amount: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  @ApiProperty({
    description: 'Subtotal de la venta',
    required: false,
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  @ApiProperty({
    description: 'Monto de impuestos',
    required: false,
  })
  tax_amount: number;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  @ApiProperty({
    description: 'Id del metodo de pago',
    required: false,
  })
  payment_method_id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'Fecha de la venta',
  })
  sale_date: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'completed',
  })
  @ApiProperty({
    description: 'Estado de la venta',
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'completed',
  })
  status: SaleStatus;

  // Relaciones con otras tablas
  @OneToOne(() => Transaction, (transaction) => transaction.sale)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.sales)
  @JoinColumn({ name: 'payment_method_id'})
  payment_method: PaymentMethod;

  @OneToMany(() => SaleItem, saleItem => saleItem.sale)
  sale_items: SaleItem[];
}
