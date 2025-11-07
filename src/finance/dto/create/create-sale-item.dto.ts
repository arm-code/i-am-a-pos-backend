
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsUUID()
  product_id: string;

  @ApiProperty({ description: 'Cantidad vendida', example: 2 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: 'Precio unitario', example: 500.25 })
  @IsNumber()
  @Type(() => Number)
  unit_price: number;

  @ApiProperty({ description: 'Precio total (cantidad * precio unitario)', example: 1000.50 })
  @IsNumber()
  @Type(() => Number)
  total_price: number;
}