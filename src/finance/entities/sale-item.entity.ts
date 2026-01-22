
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Sale } from './sale.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sale_items')
export class SaleItem extends BaseEntity {
  @Column()
  @ApiProperty({ description: 'ID de la venta' })
  sale_id: number;

  @Column()
  @ApiProperty({ description: 'ID del producto' })
  product_id: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: 'Cantidad vendida', example: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Precio unitario', example: 500.25 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty({ description: 'Precio total (cantidad * precio unitario)', example: 1000.50 })
  total_price: number;

  // Relaciones
  @ManyToOne(() => Sale, sale => sale.sale_items)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;
}