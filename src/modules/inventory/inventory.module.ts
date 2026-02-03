import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category])],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService, TypeOrmModule], // Export to use in Sales module
})
export class InventoryModule { }
