
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateSaleItemDto } from './create-sale-item.dto';

export class CreateCompleteSaleDto {
  @ApiPropertyOptional({ description: 'ID del cliente' })  
  @IsOptional()
  @IsNumber()
  customer_id?: number;

  @ApiProperty({ description: 'Monto total de la venta', example: 2500.75 })
  @IsNumber()
  @Type(() => Number)
  total_amount: number;

  @ApiPropertyOptional({ description: 'Subtotal de la venta' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  subtotal?: number;

  @ApiPropertyOptional({ description: 'Monto de impuestos' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  tax_amount?: number;

  @ApiPropertyOptional({ description: 'ID del método de pago' })  
  @IsOptional()
  @IsNumber()
  payment_method_id?: number;

  @ApiPropertyOptional({ description: 'Fecha de la venta' })
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

  @ApiPropertyOptional({ description: 'Descripción de la transacción' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Tipo de negocio' })
  @IsString()
  @IsOptional()
  business_type?: string;

  @ApiProperty({ 
    description: 'Items de la venta',
    type: [CreateSaleItemDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  sale_items: CreateSaleItemDto[];
}