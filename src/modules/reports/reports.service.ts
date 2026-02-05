import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Expense } from '../finance/entities/expense.entity';
import { CashShift } from '../finance/entities/cash-shift.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
    ) { }

    private parseLocalDate(dateStr: string): Date {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    async getCorteCaja(dateStr: string) {
        const localDate = this.parseLocalDate(dateStr);

        const startOfDay = new Date(localDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(localDate);
        endOfDay.setHours(23, 59, 59, 999);

        console.log(`[Reports] Corte de Caja para (Local): ${startOfDay.toLocaleString()} - ${endOfDay.toLocaleString()}`);

        const sales = await this.saleRepository.find({
            where: {
                createdAt: Between(startOfDay, endOfDay),
            },
            relations: ['paymentMethod'],
        });

        console.log(`[Reports] Ventas encontradas: ${sales.length}`);

        const totalSold = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const byPaymentType = sales.reduce((acc, sale) => {
            const type = sale.paymentMethod?.key || 'Otro';
            acc[type] = (acc[type] || 0) + Number(sale.total);
            return acc;
        }, {});

        return {
            date: dateStr,
            totalSales: sales.length,
            totalIncome: totalSold,
            details: byPaymentType,
        };
    }

    async getDayProfitQueryBuilder(dateStr: string) {
        const localDate = this.parseLocalDate(dateStr);
        const start = new Date(localDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(localDate);
        end.setHours(23, 59, 59, 999);

        const result = await this.saleRepository.createQueryBuilder('sale')
            .leftJoin('sale.items', 'item')
            .leftJoin('item.product', 'product')
            .select('SUM(sale.total)', 'revenue')
            .addSelect('SUM(item.quantity * product.costPrice)', 'cost')
            .where('sale.createdAt BETWEEN :start AND :end', { start, end })
            .getRawOne();

        const revenue = Number(result.revenue) || 0;
        const cost = Number(result.cost) || 0;

        return {
            date: dateStr,
            revenue,
            cost,
            netProfit: revenue - cost,
        };
    }

    async getShiftExpenses(shiftId: string) {
        const result = await this.expenseRepository.createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .where('expense.cashShiftId = :shiftId', { shiftId })
            .getRawOne();

        return {
            shiftId,
            totalExpenses: Number(result.total) || 0,
        };
    }
}
