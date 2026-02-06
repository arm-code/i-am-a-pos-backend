import { Controller, Post, Get, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FinanceService } from './services/finance.service';
import { CreateCashShiftDto } from './dto/create-cash-shift.dto';
import { CloseCashShiftDto } from './dto/close-cash-shift.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@ApiTags('Finance')
@ApiBearerAuth()
@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Post('shift/open')
    async openShift(@Body() createCashShiftDto: CreateCashShiftDto, @Req() req: any) {
        return await this.financeService.openShift(createCashShiftDto, req.user);
    }

    @Post('shift/close')
    async closeShift(@Body() closeCashShiftDto: CloseCashShiftDto) {
        return await this.financeService.closeShift(closeCashShiftDto);
    }

    @Get('shift/active')
    async getActiveShift() {
        return await this.financeService.getActiveShift();
    }

    @Get('shifts')
    @ApiOperation({ summary: 'Get all historical cash shifts (listing)' })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Límite de resultados',
        type: Number
    })
    async findAllShifts(@Query('limit') limit?: number) {
        return await this.financeService.findAllShifts(limit ? Number(limit) : undefined);
    }

    @Post('expenses')
    async createExpense(@Body() createExpenseDto: CreateExpenseDto) {
        return await this.financeService.createExpense(createExpenseDto);
    }

    @Get('expenses')
    async findAllExpenses() {
        return await this.financeService.findAllExpenses();
    }

    @Get('expenses/active-shift')
    async findActiveShiftExpenses() {
        return await this.financeService.findActiveShiftExpenses();
    }
}

