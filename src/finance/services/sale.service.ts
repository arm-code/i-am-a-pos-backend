// src/finance/services/sale.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { SaleItem } from '../entities/sale-item.entity';
import { Transaction } from '../entities/transaction.entity';
import { CreateSaleDto } from '../dto/create/create-sale.dto';
import { CreateCompleteSaleDto } from '../dto/create/create-complete-sale.dto';

@Injectable()
export class SaleService {
  private readonly logger = new Logger(SaleService.name);

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async createCompleteSale(createCompleteSaleDto: CreateCompleteSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('Iniciando proceso de venta completa...');

      // 1. Crear transacción
      const transaction = this.transactionRepository.create({
        type: 'sale',
        amount: createCompleteSaleDto.total_amount,
        description: createCompleteSaleDto.description || `Venta de productos`,
        business_type: createCompleteSaleDto.business_type,
        status: 'completed',
        transaction_date: createCompleteSaleDto.sale_date || new Date(),
      });

      const savedTransaction = await queryRunner.manager.save(Transaction, transaction);      

      // 2. Crear venta
      const sale = this.saleRepository.create({
        transaction_id:  savedTransaction.id,
        customer_id: createCompleteSaleDto.customer_id,
        total_amount: createCompleteSaleDto.total_amount,
        subtotal: createCompleteSaleDto.subtotal || createCompleteSaleDto.total_amount,
        tax_amount: createCompleteSaleDto.tax_amount || 0,
        payment_method_id: createCompleteSaleDto.payment_method_id,
        sale_date: createCompleteSaleDto.sale_date || new Date(),
        status: 'completed',
      });

      const savedSale = await queryRunner.manager.save(sale);

      // 3. Crear items de venta
      if (createCompleteSaleDto.sale_items && createCompleteSaleDto.sale_items.length > 0) {
        const saleItems = createCompleteSaleDto.sale_items.map(item =>
          this.saleItemRepository.create({
            sale_id: savedSale.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
          })
        );

        await queryRunner.manager.save(saleItems);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Venta completada exitosamente con ID: ${savedSale.id}`);

      // Retornar venta con relaciones
      const saleResponse =  await this.saleRepository.findOne({
        where: { id: savedSale.id },
        relations: ['transaction', 'sale_items'],
      });

      if(!saleResponse){
        throw new NotFoundException(`Venta con ID ${savedSale.id} no encontrada`);
    }

    return saleResponse

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error en proceso de venta:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleRepository.find({
      relations: ['transaction', 'sale_items', 'payment_method'],
      order: { sale_date: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['transaction', 'sale_items', 'payment_method'],
    });

    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return sale;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return await this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.transaction', 'transaction')
      .leftJoinAndSelect('sale.sale_items', 'sale_items')
      .where('sale.sale_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('sale.sale_date', 'DESC')
      .getMany();
  }

  async getDailySales(): Promise<{ date: string; total: number; count: number }[]> {
    return await this.saleRepository
      .createQueryBuilder('sale')
      .select("DATE(sale.sale_date)", "date")
      .addSelect("SUM(sale.total_amount)", "total")
      .addSelect("COUNT(sale.id)", "count")
      .where('sale.status = :status', { status: 'completed' })
      .groupBy("DATE(sale.sale_date)")
      .orderBy("date", "DESC")
      .getRawMany();
  }

  async cancelSale(id: number): Promise<Sale> {
    const sale = await this.findOne(id);
    
    // Crear transacción de reverso
    const refundTransaction = this.transactionRepository.create({
      type: 'expense',
      amount: sale.total_amount,
      description: `Reembolso de venta #${sale.id}`,
      status: 'completed',
      transaction_date: new Date(),
    });

    await this.transactionRepository.save(refundTransaction);

    // Actualizar estado de la venta
    sale.status = 'cancelled';
    const updatedSale = await this.saleRepository.save(sale);

    this.logger.log(`Venta con ID ${id} cancelada`);
    return updatedSale;
  }
}