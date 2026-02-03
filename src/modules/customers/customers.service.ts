import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
    ) { }

    async create(createCustomerDto: CreateCustomerDto) {
        const customer = this.customerRepository.create({
            ...createCustomerDto,
            name: createCustomerDto.name.toUpperCase(),
        });
        return await this.customerRepository.save(customer);
    }

    async findAll() {
        return await this.customerRepository.find();
    }

    async findOne(id: string) {
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: ['sales'],
        });
        if (!customer)
            throw new NotFoundException(`Customer with ID ${id} not found`);
        return customer;
    }

    async updateBalance(id: string, amount: number) {
        const customer = await this.findOne(id);
        customer.balance = Number(customer.balance) + Number(amount);
        return await this.customerRepository.save(customer);
    }

    async registerPayment(id: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be greater than zero');
        }

        const customer = await this.findOne(id);
        const currentBalance = Number(customer.balance);

        if (currentBalance <= 0) {
            throw new BadRequestException('Customer has no debt (balance is already 0)');
        }

        if (amount > currentBalance) {
            throw new BadRequestException(
                `Payment amount (${amount}) exceeds current debt (${currentBalance})`,
            );
        }

        // Amount is subtracted from balance (debt)
        customer.balance = currentBalance - Number(amount);
        return await this.customerRepository.save(customer);
    }

    async remove(id: string) {
        const customer = await this.findOne(id);
        await this.customerRepository.remove(customer);
        return { deleted: true };
    }
}
