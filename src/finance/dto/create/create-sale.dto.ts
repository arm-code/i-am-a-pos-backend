import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CreateSaleItemDto } from './create-sale-item.dto';

export class CreateSaleDto {
  @ApiPropertyOptional({
    description: 'Id del cliente',
  })
  @IsNumber()
  @IsOptional()
  customer_id?: number;

  @ApiProperty({
    description: 'Monto total de la transaccion',
    example: 445.33,
  })
  @IsNumber()
  @Type(() => Number)
  total_amount: number;

  @ApiPropertyOptional({
    description: 'Subtotal de la venta',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  subtotal?: number;

  @ApiPropertyOptional({
    description: 'Monto de impuestos',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  tax_amount?: number;

  @ApiPropertyOptional({ description: 'ID del método de pago' })
  @IsNumber()
  @IsOptional()
  payment_method_id?: number;

  @ApiPropertyOptional({ description: 'Fecha de la venta' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  sale_date?: Date;

  @ApiPropertyOptional({
    description: 'Estado de la venta',
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'completed'
  })
  @IsEnum(['pending', 'completed', 'cancelled', 'refunded'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ 
    description: 'Items de la venta',
    type: [CreateSaleItemDto] 
  })
  @IsOptional()
  sale_items?: CreateSaleItemDto[];
}
