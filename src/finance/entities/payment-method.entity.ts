
import { Entity, Column, OneToMany } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../shared/base.entity';
import { Sale } from './sale.entity';

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'Nombre del método de pago', example: 'Tarjeta de Crédito' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ 
    description: 'Descripción del método de pago',
    required: false,
    example: 'Pago con tarjeta de crédito Visa/Mastercard'
  })
  description: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Indica si el método está activo', default: true })
  is_active: boolean;

  // Relaciones
  @OneToMany(() => Sale, sale => sale.payment_method)
  sales: Sale[];
}