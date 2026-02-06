import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomersModule } from '../customers/customers.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale, SaleItem, PaymentMethod]),
        InventoryModule,
        CustomersModule,
        FinanceModule,
    ],
    controllers: [SalesController],
    providers: [SalesService],
    exports: [SalesService, TypeOrmModule],
})
export class SalesModule { }

