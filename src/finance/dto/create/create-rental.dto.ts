import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRentalDto {
  @ApiPropertyOptional({ description: 'ID del cliente' })
  @IsNumber()
  @IsOptional()
  customer_id?: number;

  @ApiProperty({ description: 'ID del producto rentado' })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'Fecha de inicio de la renta' })
  @IsDate()
  @Type(() => Date)
  rental_start: Date;

  @ApiProperty({ description: 'Fecha de fin de la renta' })
  @IsDate()
  @Type(() => Date)
  rental_end: Date;

  @ApiProperty({ description: 'Monto total de la renta', example: 1200.0 })
  @IsNumber()
  @Type(() => Number)
  total_amount: number;

  @ApiPropertyOptional({
    description: 'Monto del depósito',
    example: 500.0,
    default: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  deposit_amount?: number;

  @ApiPropertyOptional({
    description: 'Estado de la renta',
    enum: ['active', 'completed', 'cancelled', 'overdue'],
    default: 'active',
  })
  @IsEnum(['active', 'completed', 'cancelled', 'overdue'])
  @IsOptional()
  status?: string;
}
