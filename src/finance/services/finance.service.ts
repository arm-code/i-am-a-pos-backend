// src/finance/services/finance.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SaleService } from './sale.service';
import { RentalService } from './rental.service';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly saleService: SaleService,
    private readonly rentalService: RentalService,
  ) {}

  async getFinancialSummary(startDate: Date, endDate: Date) {
    this.logger.log(`Generando resumen financiero desde ${startDate} hasta ${endDate}`);

    const [
      totalSales,
      totalRentals,
      salesByDate,
      rentalRevenue
    ] = await Promise.all([
      this.saleService.getDailySales(),
      this.rentalService.calculateRentalRevenue(startDate, endDate),
      this.saleService.getSalesByDateRange(startDate, endDate),
      this.rentalService.calculateRentalRevenue(startDate, endDate)
    ]);

    const totalRevenue = salesByDate.reduce((sum, sale) => sum + sale.total_amount, 0) + rentalRevenue;

    return {
      period: { startDate, endDate },
      summary: {
        totalRevenue,
        totalSales: salesByDate.length,
        totalRentals: rentalRevenue > 0 ? 'Activas' : 0,
        averageSale: salesByDate.length > 0 ? totalRevenue / salesByDate.length : 0,
      },
      dailySales: totalSales,
      activeRentals: await this.rentalService.getActiveRentals(),
      overdueRentals: await this.rentalService.getOverdueRentals(),
    };
  }

 
}