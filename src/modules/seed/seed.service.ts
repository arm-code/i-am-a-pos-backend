import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../inventory/entities/product.entity';
import { Category } from '../inventory/entities/category.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PaymentMethod } from '../sales/entities/payment-method.entity';

@Injectable()
export class SeedService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,
    ) { }

    async runSeed() {
        await this.cleanDatabase();

        const paymentMethods = await this.seedPaymentMethods();
        const categories = await this.seedCategories();
        await this.seedProducts(categories);
        await this.seedCustomers();

        return { message: 'Seed executed successfully' };
    }

    private async cleanDatabase() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.query('SET session_replication_role = replica;');

        const tables = this.dataSource.entityMetadatas.map(
            (meta) => `"${meta.tableName}"`,
        );

        for (const table of tables) {
            await queryRunner.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
        }

        await queryRunner.query('SET session_replication_role = DEFAULT;');
        await queryRunner.release();
    }

    private async seedPaymentMethods() {
        const methods = [
            {
                key: 'CASH',
                name: 'EFECTIVO',
            },
            {
                key: 'CARD',
                name: 'TARJETA',
            },
            {
                key: 'CREDIT',
                name: 'CRÉDITO',
            },
        ];

        const paymentMethods = this.paymentMethodRepository.create(methods);
        return await this.paymentMethodRepository.save(paymentMethods);
    }

    private async seedCategories() {
        const categoriesData = [
            { name: 'BEBIDAS', description: 'REFRESCOS, JUGOS Y AGUAS' },
            { name: 'SNACKS', description: 'BOTANAS Y DULCES' },
            { name: 'LÁCTEOS', description: 'LECHE, QUESOS Y YOGURES' },
            { name: 'ABARROTES', description: 'PRODUCTOS BÁSICOS DEL HOGAR' },
        ];

        const categories = this.categoryRepository.create(categoriesData);
        return await this.categoryRepository.save(categories);
    }

    private async seedProducts(categories: Category[]) {
        const productsData = [
            {
                name: 'COCA COLA 600ML',
                barcode: '7501055300074',
                purchasePrice: 12,
                sellPrice: 18,
                stock: 50,
                minStock: 10,
                unit: 'PZA',
                category: categories[0],
            },
            {
                name: 'SABRITAS SAL 45G',
                barcode: '7501011115322',
                purchasePrice: 10,
                sellPrice: 16,
                stock: 30,
                minStock: 5,
                unit: 'PZA',
                category: categories[1],
            },
            {
                name: 'LECHE ENTERA 1L',
                barcode: '7501020512128',
                purchasePrice: 20,
                sellPrice: 26,
                stock: 20,
                minStock: 4,
                unit: 'PZA',
                category: categories[2],
            },
            {
                name: 'HUEVOS 1KG',
                barcode: '0000000000001',
                purchasePrice: 35,
                sellPrice: 45,
                stock: 15,
                minStock: 2,
                unit: 'KG',
                category: categories[3],
            },
        ];

        const products = this.productRepository.create(productsData);
        return await this.productRepository.save(products);
    }

    private async seedCustomers() {
        const customersData = [
            { name: 'JUAN PÉREZ', phone: '5551234567', balance: 0 },
            { name: 'MARÍA GARCÍA', phone: '5559876543', balance: 150 },
            { name: 'CLIENTE FRECUENTE', phone: '0000000000', balance: 0 },
        ];

        const customers = this.customerRepository.create(customersData);
        return await this.customerRepository.save(customers);
    }
}
