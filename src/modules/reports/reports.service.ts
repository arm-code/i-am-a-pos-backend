import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
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

    async getNetProfit(startDateStr: string, endDateStr: string) {
        const start = this.parseLocalDate(startDateStr);
        start.setHours(0, 0, 0, 0);

        const end = this.parseLocalDate(endDateStr);
        end.setHours(23, 59, 59, 999);

        console.log(`[Reports] Net Profit para (Local): ${start.toLocaleString()} - ${end.toLocaleString()}`);

        const sales = await this.saleRepository.find({
            where: {
                createdAt: Between(start, end),
            },
            relations: ['items', 'items.product'],
        });

        let totalRevenue = 0;
        let totalCost = 0;

        sales.forEach((sale) => {
            totalRevenue += Number(sale.total);
            sale.items.forEach((item) => {
                totalCost += Number(item.product.purchasePrice) * Number(item.quantity);
            });
        });

        return {
            revenue: totalRevenue,
            cost: totalCost,
            netProfit: totalRevenue - totalCost,
        };
    }
}
