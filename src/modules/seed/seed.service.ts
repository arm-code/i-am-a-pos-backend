import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../inventory/entities/product.entity';
import { Category } from '../inventory/entities/category.entity';
import { Customer } from '../customers/entities/customer.entity';

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
    ) { }

    async runSeed() {
        await this.cleanDatabase();

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

    private async seedCategories() {
        const categoriesData = [
            { name: 'Bebidas', description: 'Refrescos, jugos y aguas' },
            { name: 'Snacks', description: 'Botanas y dulces' },
            { name: 'Lácteos', description: 'Leche, quesos y yogures' },
            { name: 'Abarrotes', description: 'Productos básicos del hogar' },
        ];

        const categories = this.categoryRepository.create(categoriesData);
        return await this.categoryRepository.save(categories);
    }

    private async seedProducts(categories: Category[]) {
        const productsData = [
            {
                name: 'Coca Cola 600ml',
                barcode: '7501055300074',
                purchasePrice: 12,
                sellPrice: 18,
                stock: 50,
                minStock: 10,
                unit: 'Pza',
                category: categories[0],
            },
            {
                name: 'Sabritas Sal 45g',
                barcode: '7501011115322',
                purchasePrice: 10,
                sellPrice: 16,
                stock: 30,
                minStock: 5,
                unit: 'Pza',
                category: categories[1],
            },
            {
                name: 'Leche Entera 1L',
                barcode: '7501020512128',
                purchasePrice: 20,
                sellPrice: 26,
                stock: 20,
                minStock: 4,
                unit: 'Pza',
                category: categories[2],
            },
            {
                name: 'Huevos 1kg',
                barcode: '0000000000001',
                purchasePrice: 35,
                sellPrice: 45,
                stock: 15,
                minStock: 2,
                unit: 'Kg',
                category: categories[3],
            },
        ];

        const products = this.productRepository.create(productsData);
        return await this.productRepository.save(products);
    }

    private async seedCustomers() {
        const customersData = [
            { name: 'Juan Pérez', phone: '5551234567', balance: 0 },
            { name: 'María García', phone: '5559876543', balance: 150 },
            { name: 'Cliente Frecuente', phone: '0000000000', balance: 0 },
        ];

        const customers = this.customerRepository.create(customersData);
        return await this.customerRepository.save(customers);
    }
}
