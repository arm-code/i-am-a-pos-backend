import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Rental } from './entities/rental.entity';

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
  providers: [FinanceService],
  exports: [TypeOrmModule],
})
export class FinanceModule {}
