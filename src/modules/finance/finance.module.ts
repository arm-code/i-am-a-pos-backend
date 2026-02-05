import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashShift } from './entities/cash-shift.entity';
import { Expense } from './entities/expense.entity';
import { FinanceService } from './services/finance.service';
import { FinanceController } from './finance.controller';
import { Sale } from '../sales/entities/sale.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CashShift, Expense, Sale]),
    ],
    controllers: [FinanceController],
    providers: [FinanceService],
    exports: [FinanceService],
})
export class FinanceModule { }
