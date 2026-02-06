import { IsEnum, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../entities/expense.entity';

export class CreateExpenseDto {
    @ApiProperty({
        example: 'Pago de Luz - Local Principal',
        description: 'Descripción detallada del gasto',
    })
    @IsString()
    @MinLength(3)
    description: string;

    @ApiProperty({
        example: 450.00,
        description: 'Monto total del gasto realizado',
    })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({
        example: 'Luz',
        enum: ExpenseCategory,
        description: 'Categoría del gasto para reportes financieros',
    })
    @IsEnum(ExpenseCategory)
    category: ExpenseCategory;
}

