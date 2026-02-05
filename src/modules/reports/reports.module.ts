import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Sale } from '../sales/entities/sale.entity';
import { Expense } from '../finance/entities/expense.entity';
import { CashShift } from '../finance/entities/cash-shift.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, Expense, CashShift])],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule { }
