import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CashShift, CashShiftStatus } from '../entities/cash-shift.entity';
import { Expense } from '../entities/expense.entity';
import { CreateCashShiftDto } from '../dto/create-cash-shift.dto';
import { CloseCashShiftDto } from '../dto/close-cash-shift.dto';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { Sale } from '../../sales/entities/sale.entity';
import { User } from '../../../auth/entities/user.entity';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(CashShift)
        private readonly cashShiftRepository: Repository<CashShift>,
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
    ) { }

    async openShift(createCashShiftDto: CreateCashShiftDto, user: User): Promise<CashShift> {
        const activeShift = await this.getActiveShift();
        if (activeShift) {
            throw new BadRequestException('There is already an active shift.');
        }

        const shift = this.cashShiftRepository.create({
            ...createCashShiftDto,
            status: CashShiftStatus.OPEN,
            startTime: new Date(),
            user: user,
        });

        return await this.cashShiftRepository.save(shift);
    }

    async getActiveShift(): Promise<CashShift | null> {
        return await this.cashShiftRepository.findOne({
            where: { status: CashShiftStatus.OPEN },
        });
    }

    async closeShift(closeCashShiftDto: CloseCashShiftDto): Promise<CashShift> {
        const activeShift = await this.getActiveShift();
        if (!activeShift) {
            throw new BadRequestException('No active shift found.');
        }

        // Get all sales for this shift
        const sales = await this.saleRepository.find({
            where: { cashShift: { id: activeShift.id } },
        });
        const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

        // Get all expenses for this shift
        const expenses = await this.expenseRepository.find({
            where: { cashShift: { id: activeShift.id } },
        });
        const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

        const expectedBalance = Number(activeShift.initialBalance) + totalSales - totalExpenses;
        const difference = closeCashShiftDto.realBalance - expectedBalance;

        activeShift.expectedBalance = expectedBalance;
        activeShift.realBalance = closeCashShiftDto.realBalance;
        activeShift.difference = difference;
        activeShift.status = CashShiftStatus.CLOSED;
        activeShift.endTime = new Date();

        return await this.cashShiftRepository.save(activeShift);
    }

    async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const activeShift = await this.getActiveShift();
        if (!activeShift) {
            throw new BadRequestException('No active shift found. Cannot record expense.');
        }

        const expense = this.expenseRepository.create({
            ...createExpenseDto,
            cashShift: activeShift,
        });

        return await this.expenseRepository.save(expense);
    }

    async findAllExpenses(): Promise<Expense[]> {
        return await this.expenseRepository.find({
            relations: ['cashShift'],
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveShiftExpenses(): Promise<Expense[]> {
        const activeShift = await this.getActiveShift();
        if (!activeShift) return [];

        return await this.expenseRepository.find({
            where: { cashShift: { id: activeShift.id } },
            order: { createdAt: 'DESC' }
        });
    }

    async findAllShifts(limit?: number): Promise<CashShift[]> {
        return await this.cashShiftRepository.find({
            relations: ['user'],
            order: { startTime: 'DESC' },
            take: limit,
        });
    }
}

