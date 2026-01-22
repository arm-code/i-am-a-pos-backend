import { Module } from '@nestjs/common';
import { FinanceService } from './services/finance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Rental } from './entities/rental.entity';
import { RentalService } from './services/rental.service';
import { SaleService } from './services/sale.service';
import { TransactionService } from './services/transaction.service';
import { FinanceController } from './controllers/finance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      PaymentMethod,
      Sale,
      SaleItem,
      Rental,
    ]),
  ],
  controllers: [FinanceController],
  providers: [FinanceService, RentalService, SaleService, TransactionService],
  exports: [TypeOrmModule],
})
export class FinanceModule {}
