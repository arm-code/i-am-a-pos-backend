import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Product } from '../inventory/entities/product.entity';
import { Category } from '../inventory/entities/category.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PaymentMethod } from '../sales/entities/payment-method.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, Customer, PaymentMethod])],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeedModule { }
