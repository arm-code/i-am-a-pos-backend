import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Movement, MovementType } from './entities/movement.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Movement)
        private readonly movementRepository: Repository<Movement>,
        @InjectRepository(InventoryAdjustment)
        private readonly adjustmentRepository: Repository<InventoryAdjustment>,
    ) { }

    async createProduct(createProductDto: CreateProductDto) {
        const { categoryId, ...productDetails } = createProductDto;

        const product = this.productRepository.create({
            ...productDetails,
            name: productDetails.name.toUpperCase(),
            description: productDetails.description?.toUpperCase(),
            barcode: productDetails.barcode.toUpperCase(),
            unit: productDetails.unit.toUpperCase(),
            category: categoryId ? ({ id: categoryId } as any) : undefined,
        });

        return await this.productRepository.save(product);
    }

    async findAllProducts(searchTerm?: string) {
        if (searchTerm) {
            return await this.productRepository.find({
                where: [
                    { name: Like(`%${searchTerm}%`) },
                    { barcode: Like(`%${searchTerm}%`) },
                ],
                relations: ['category'],
            });
        }
        return await this.productRepository.find({ relations: ['category'] });
    }

    async findOneProduct(id: string) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
        return product;
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        const { categoryId, ...productDetails } = updateProductDto;

        const product = await this.findOneProduct(id);

        const updatedProduct = this.productRepository.create({
            ...product,
            ...productDetails,
            name: productDetails.name?.toUpperCase() || product.name,
            description: productDetails.description?.toUpperCase() || product.description,
            barcode: productDetails.barcode?.toUpperCase() || product.barcode,
            unit: productDetails.unit?.toUpperCase() || product.unit,
            category: categoryId ? ({ id: categoryId } as any) : product.category,
        });

        return await this.productRepository.save(updatedProduct);
    }

    async removeProduct(id: string) {
        const product = await this.findOneProduct(id);
        await this.productRepository.remove(product);
        return { deleted: true };
    }

    async addStock(id: string, amount: number, reason?: string) {
        if (amount <= 0) {
            throw new BadRequestException('Amount to add must be greater than zero');
        }

        const product = await this.findOneProduct(id);
        product.stock = Number(product.stock) + Number(amount);

        // Record movement
        const movement = this.movementRepository.create({
            product,
            quantity: amount,
            type: MovementType.ADJUSTMENT,
            reason: reason || 'Ajuste manual de stock',
        });
        await this.movementRepository.save(movement);

        return await this.productRepository.save(product);
    }

    async registerAdjustment(createAdjustmentDto: CreateAdjustmentDto) {
        const { productId, quantity, reason } = createAdjustmentDto;

        const product = await this.findOneProduct(productId);

        // Update product stock
        product.stock = Number(product.stock) + Number(quantity);
        await this.productRepository.save(product);

        // Record adjustment
        const adjustment = this.adjustmentRepository.create({
            product,
            quantity,
            reason,
        });
        const savedAdjustment = await this.adjustmentRepository.save(adjustment);

        // Record movement
        const movement = this.movementRepository.create({
            product,
            quantity,
            type: MovementType.ADJUSTMENT,
            reason: `Ajuste manual: ${reason}`,
        });
        await this.movementRepository.save(movement);

        return savedAdjustment;
    }

    async findAllMovements() {
        return await this.movementRepository.find({
            relations: ['product'],
            order: { createdAt: 'DESC' },
        });
    }

    // Category Methods
    async createCategory(name: string, description?: string) {
        const category = this.categoryRepository.create({
            name: name.toUpperCase(),
            description: description?.toUpperCase(),
        });
        return await this.categoryRepository.save(category);
    }

    async findAllCategories() {
        return await this.categoryRepository.find();
    }
}
