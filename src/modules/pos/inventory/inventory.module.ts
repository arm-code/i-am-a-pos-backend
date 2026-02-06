import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Movement } from './entities/movement.entity';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, Movement, InventoryAdjustment])],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService, TypeOrmModule], // Export to use in Sales module
})
export class InventoryModule { }

