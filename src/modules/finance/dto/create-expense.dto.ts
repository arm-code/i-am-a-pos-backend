import { IsEnum, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { ExpenseCategory } from '../entities/expense.entity';

export class CreateExpenseDto {
    @IsString()
    @MinLength(3)
    description: string;

    @IsNumber()
    @IsPositive()
    amount: number;

    @IsEnum(ExpenseCategory)
    category: ExpenseCategory;
}
