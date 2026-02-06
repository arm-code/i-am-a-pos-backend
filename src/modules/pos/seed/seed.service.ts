import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../inventory/entities/product.entity';
import { Category } from '../inventory/entities/category.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PaymentMethod } from '../sales/entities/payment-method.entity';
import { User, UserRole } from '../../auth/entities/user.entity';

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
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async runSeed() {
        await this.cleanDatabase();

        const paymentMethods = await this.seedPaymentMethods();
        const categories = await this.seedCategories();
        await this.seedProducts(categories);
        await this.seedCustomers();
        await this.seedUsers();

        return { message: 'Seed executed successfully - Business Toolbox Ready' };
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
            { key: 'CASH', name: 'EFECTIVO' },
            { key: 'CARD', name: 'TARJETA' },
            { key: 'TRANSFER', name: 'TRANSFERENCIA' },
            { key: 'CREDIT', name: 'CRÉDITO' },
        ];
        return await this.paymentMethodRepository.save(this.paymentMethodRepository.create(methods));
    }

    private async seedCategories() {
        const categoriesData = [
            { name: 'BEBIDAS', description: 'REFRESCOS, JUGOS Y AGUAS' },
            { name: 'SNACKS', description: 'BOTANAS Y DULCES' },
            { name: 'LÁCTEOS', description: 'LECHE, QUESOS Y YOGURES' },
            { name: 'ABARROTES', description: 'PRODUCTOS BÁSICOS DEL HOGAR' },
            { name: 'LIMPIEZA', description: 'PRODUCTOS PARA EL HOGAR' },
            { name: 'FARMACIA', description: 'MEDICAMENTOS DE VENTA LIBRE' },
        ];
        return await this.categoryRepository.save(this.categoryRepository.create(categoriesData));
    }

    private async seedProducts(categories: Category[]) {
        const productsData = [
            { name: 'COCA COLA 600ML', barcode: '7501055300074', purchasePrice: 12, costPrice: 12, sellPrice: 18, stock: 50, minStock: 10, unit: 'PZA', category: categories[0] },
            { name: 'PEPSI 600ML', barcode: '7501031302720', purchasePrice: 11, costPrice: 11, sellPrice: 17, stock: 40, minStock: 10, unit: 'PZA', category: categories[0] },
            { name: 'AGUA CIEL 1L', barcode: '7501055305116', purchasePrice: 8, costPrice: 8, sellPrice: 14, stock: 60, minStock: 12, unit: 'PZA', category: categories[0] },

            { name: 'SABRITAS SAL 45G', barcode: '7501011115322', purchasePrice: 10, costPrice: 10, sellPrice: 16, stock: 30, minStock: 5, unit: 'PZA', category: categories[1] },
            { name: 'DORITOS NACHO 58G', barcode: '7501011131018', purchasePrice: 11, costPrice: 11, sellPrice: 17, stock: 25, minStock: 5, unit: 'PZA', category: categories[1] },

            { name: 'LECHE ENTERA 1L', barcode: '7501020512128', purchasePrice: 20, costPrice: 20, sellPrice: 26, stock: 20, minStock: 4, unit: 'PZA', category: categories[2] },
            { name: 'YOGURT FRESA 250G', barcode: '7501032331224', purchasePrice: 9, costPrice: 9, sellPrice: 14, stock: 15, minStock: 3, unit: 'PZA', category: categories[2] },

            { name: 'HUEVOS 12PZ', barcode: '7501040001009', purchasePrice: 32, costPrice: 32, sellPrice: 42, stock: 10, minStock: 2, unit: 'PZA', category: categories[3] },
            { name: 'ARROZ BLANCO 1KG', barcode: '7501071301014', purchasePrice: 18, costPrice: 18, sellPrice: 25, stock: 20, minStock: 5, unit: 'KG', category: categories[3] },

            { name: 'CLORO 1L', barcode: '7501025400116', purchasePrice: 12, costPrice: 12, sellPrice: 19, stock: 15, minStock: 3, unit: 'PZA', category: categories[4] },
            { name: 'FABULOSO 1L', barcode: '7501035911430', purchasePrice: 15, costPrice: 15, sellPrice: 22, stock: 12, minStock: 3, unit: 'PZA', category: categories[4] },

            { name: 'PARACETAMOL 500MG', barcode: '7501111111118', purchasePrice: 25, costPrice: 25, sellPrice: 45, stock: 10, minStock: 2, unit: 'PZA', category: categories[5] },
        ];
        return await this.productRepository.save(this.productRepository.create(productsData));
    }

    private async seedCustomers() {
        const customersData = [
            { name: 'JUAN PÉREZ', phone: '5551234567', balance: 0 },
            { name: 'MARÍA GARCÍA', phone: '5559876543', balance: 150 },
            { name: 'CLIENTE FRECUENTE', phone: '0000000000', balance: 0 },
        ];
        return await this.customerRepository.save(this.customerRepository.create(customersData));
    }

    private async seedUsers() {
        const users = [
            {
                email: 'admin@business-toolbox.com',
                password: 'adminPassword123!',
                firstName: 'Admin',
                lastName: 'General',
                role: UserRole.ADMIN,
            },
            {
                email: 'guest@business-toolbox.demo',
                password: 'guest-password-demo',
                firstName: 'Usuario',
                lastName: 'Invitado',
                role: UserRole.GUEST,
            }
        ];

        for (const userData of users) {
            const user = this.userRepository.create(userData);
            await this.userRepository.save(user);
        }
    }
}
