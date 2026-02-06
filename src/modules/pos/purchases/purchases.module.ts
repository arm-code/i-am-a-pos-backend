import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { PurchasesService } from './services/purchases.service';
import { PurchasesController } from './purchases.controller';
import { Product } from '../inventory/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Supplier, Purchase, PurchaseItem, Product]),
    ],
    controllers: [PurchasesController],
    providers: [PurchasesService],
    exports: [PurchasesService],
})
export class PurchasesModule { }

