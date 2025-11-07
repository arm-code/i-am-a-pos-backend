import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Tipo de transaccion',
    enum: ['income', 'expense', 'sale', 'rental'],
  })
  @IsEnum(['income', 'expense', 'sale', 'rental'])
  type: string;

  @ApiProperty({
    description: 'Monto de la transaccion',
    example: 1500.59,
  })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({
    description: 'Moneda de la transaccion',
    example: 'MXN',
    default: 'MXN',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Descripcion de la transaccion',
    example: 'Venta de 2 barras de hielo',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de la transaccion',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  transaction_date?: Date;

  @ApiPropertyOptional({
    description: 'Estado de la transaccion',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed',
  })
  @IsEnum(['pending', 'completed', 'cancelled'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Tipo de negocio (para filtros)',
    example: 'retail',
  })
  @IsString()
  @IsOptional()
  business_type?: string;
}
