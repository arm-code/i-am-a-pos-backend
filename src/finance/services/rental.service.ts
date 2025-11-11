// src/finance/services/rental.service.ts
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Rental } from '../entities/rental.entity';
import { Transaction } from '../entities/transaction.entity';
import { CreateRentalDto } from '../dto/create/create-rental.dto';

@Injectable()
export class RentalService {
  private readonly logger = new Logger(RentalService.name);

  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async createRental(createRentalDto: CreateRentalDto): Promise<Rental> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('Iniciando proceso de renta...');

      // Validar fechas
      if (createRentalDto.rental_start >= createRentalDto.rental_end) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
      }

      // 1. Crear transacción
      const transaction = this.transactionRepository.create({
        type: 'rental',
        amount: createRentalDto.total_amount,
        description: `Renta de producto ${createRentalDto.product_id}`,
        status: 'completed',
        transaction_date: new Date(),
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // 2. Crear renta
      const rental = this.rentalRepository.create({
        transaction_id: savedTransaction.id,
        customer_id: createRentalDto.customer_id,
        product_id: createRentalDto.product_id,
        rental_start: createRentalDto.rental_start,
        rental_end: createRentalDto.rental_end,
        total_amount: createRentalDto.total_amount,
        deposit_amount: createRentalDto.deposit_amount || 0,
        status: 'active',
      });

      const savedRental = await queryRunner.manager.save(rental);
      await queryRunner.commitTransaction();

      this.logger.log(`Renta creada exitosamente con ID: ${savedRental.id}`);
      
      const rentaResponse = await this.rentalRepository.findOne({
        where: { id: savedRental.id},
        relations: ['transaction'],
      })

      if(!rentaResponse){
        throw new NotFoundException(`Renta con ID ${savedRental.id} no encontrada`);
      }

      return rentaResponse;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error en proceso de renta:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Rental[]> {
    return await this.rentalRepository.find({
      relations: ['transaction'],
      order: { rental_start: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Rental> {
    const rental = await this.rentalRepository.findOne({
      where: { id },
      relations: ['transaction'],
    });

    if (!rental) {
      throw new NotFoundException(`Renta con ID ${id} no encontrada`);
    }

    return rental;
  }

  async completeRental(id: number): Promise<Rental> {
    const rental = await this.findOne(id);
    
    if (rental.status !== 'active') {
      throw new BadRequestException(`La renta con ID ${id} no está activa`);
    }

    rental.status = 'completed';
    const updatedRental = await this.rentalRepository.save(rental);

    this.logger.log(`Renta con ID ${id} marcada como completada`);
    return updatedRental;
  }

  async getActiveRentals(): Promise<Rental[]> {
    return await this.rentalRepository.find({
      where: { status: 'active' },
      relations: ['transaction'],
      order: { rental_end: 'ASC' }
    });
  }

  async getOverdueRentals(): Promise<Rental[]> {
    const now = new Date();
    return await this.rentalRepository
      .createQueryBuilder('rental')
      .where('rental.status = :status', { status: 'active' })
      .andWhere('rental.rental_end < :now', { now })
      .leftJoinAndSelect('rental.transaction', 'transaction')
      .orderBy('rental.rental_end', 'ASC')
      .getMany();
  }

  async calculateRentalRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.rentalRepository
      .createQueryBuilder('rental')
      .leftJoin('rental.transaction', 'transaction')
      .select('SUM(rental.total_amount)', 'total')
      .where('rental.rental_start BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('rental.status = :status', { status: 'completed' })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}