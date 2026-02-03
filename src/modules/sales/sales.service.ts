import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Product } from '../inventory/entities/product.entity';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        @InjectRepository(SaleItem)
        private readonly saleItemRepository: Repository<SaleItem>,
        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly dataSource: DataSource,
        private readonly customersService: CustomersService,
    ) { }

    async create(createSaleDto: CreateSaleDto) {
        const { items, paymentMethodId, customerId } = createSaleDto;

        const paymentMethod = await this.paymentMethodRepository.findOneBy({
            id: paymentMethodId,
        });
        if (!paymentMethod) {
            throw new NotFoundException(
                `Payment method with ID ${paymentMethodId} not found`,
            );
        }

        // Transaction to ensure atomicity
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let total = 0;
            const saleItems: SaleItem[] = [];

            for (const item of items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new NotFoundException(
                        `Product with ID ${item.productId} not found`,
                    );
                }

                if (Number(product.stock) < item.quantity) {
                    throw new BadRequestException(
                        `Insufficient stock for product ${product.name}. Available: ${product.stock}`,
                    );
                }

                // Deduct stock
                product.stock = Number(product.stock) - item.quantity;
                await queryRunner.manager.save(product);

                const subtotal = Number(product.sellPrice) * item.quantity;
                total += subtotal;

                const saleItem = this.saleItemRepository.create({
                    product,
                    quantity: item.quantity,
                    price: product.sellPrice,
                    subtotal,
                });
                saleItems.push(saleItem);
            }

            const sale = this.saleRepository.create({
                total,
                tax: total * 0.16, // Example 16% tax
                paymentMethod,
                items: saleItems,
            });

            if (customerId) {
                const customer = await this.customersService.findOne(customerId);
                sale.customer = customer;

                if (paymentMethod.key === 'CREDIT') {
                    await this.customersService.updateBalance(customerId, total);
                }
            } else if (paymentMethod.key === 'CREDIT') {
                throw new BadRequestException(
                    'A customer is required for credit sales',
                );
            }

            const savedSale = await queryRunner.manager.save(sale);
            await queryRunner.commitTransaction();

            return savedSale;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll() {
        return await this.saleRepository.find({
            relations: ['customer', 'items', 'items.product', 'paymentMethod'],
        });
    }

    async findOne(id: string) {
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['customer', 'items', 'items.product', 'paymentMethod'],
        });
        if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
        return sale;
    }

    // Payment Methods
    async findAllPaymentMethods() {
        return await this.paymentMethodRepository.find();
    }
}
