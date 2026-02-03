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

    async getCorteCaja(date: Date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const sales = await this.saleRepository.find({
            where: {
                createdAt: Between(startOfDay, endOfDay),
            },
            relations: ['paymentMethod'],
        });

        const totalSold = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const byPaymentType = sales.reduce((acc, sale) => {
            const type = sale.paymentMethod?.name || 'Otro';
            acc[type] = (acc[type] || 0) + Number(sale.total);
            return acc;
        }, {});

        return {
            date: startOfDay.toISOString().split('T')[0],
            totalSales: sales.length,
            totalIncome: totalSold,
            details: byPaymentType,
        };
    }

    async getNetProfit(startDate: Date, endDate: Date) {
        const sales = await this.saleRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
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
