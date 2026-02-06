import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Purchase } from '../entities/purchase.entity';
import { PurchaseItem } from '../entities/purchase-item.entity';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { Product } from '../../inventory/entities/product.entity';
import { Movement, MovementType } from '../../inventory/entities/movement.entity';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepository: Repository<Supplier>,
        @InjectRepository(Purchase)
        private readonly purchaseRepository: Repository<Purchase>,
        @InjectRepository(PurchaseItem)
        private readonly purchaseItemRepository: Repository<PurchaseItem>,
        private readonly dataSource: DataSource,
    ) { }

    async createSupplier(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
        const supplier = this.supplierRepository.create(createSupplierDto);
        return await this.supplierRepository.save(supplier);
    }

    async findAllSuppliers(): Promise<Supplier[]> {
        return await this.supplierRepository.find();
    }

    async createPurchase(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
        const { supplierId, items } = createPurchaseDto;

        const supplier = await this.supplierRepository.findOneBy({ id: supplierId });
        if (!supplier) {
            throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let totalAmount = 0;
            const purchaseItems: PurchaseItem[] = [];

            for (const item of items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new NotFoundException(`Product with ID ${item.productId} not found`);
                }

                // Increment stock and update costPrice
                product.stock = Number(product.stock) + item.quantity;
                product.costPrice = item.costPrice;
                await queryRunner.manager.save(product);

                const purchaseItem = this.purchaseItemRepository.create({
                    product,
                    quantity: item.quantity,
                    costPrice: item.costPrice,
                });
                purchaseItems.push(purchaseItem);

                totalAmount += Number(item.costPrice) * item.quantity;

                // Record movement (Audit)
                const movement = queryRunner.manager.create(Movement, {
                    product,
                    quantity: item.quantity,
                    type: MovementType.PURCHASE, // Assuming PURCHASE exists, I'll check or add it
                    reason: `Compra a proveedor: ${supplier.name}`,
                });
                await queryRunner.manager.save(movement);
            }

            const purchase = this.purchaseRepository.create({
                supplier,
                totalAmount,
                items: purchaseItems,
            });

            const savedPurchase = await queryRunner.manager.save(purchase);
            await queryRunner.commitTransaction();

            return savedPurchase;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllPurchases(): Promise<Purchase[]> {
        return await this.purchaseRepository.find({
            relations: ['supplier', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }
}

