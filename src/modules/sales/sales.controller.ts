import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @ApiOperation({ summary: 'Register a new sale' })
    create(@Body() createSaleDto: CreateSaleDto) {
        return this.salesService.create(createSaleDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sales' })
    findAll() {
        return this.salesService.findAll();
    }

    @Get('payment-methods/list')
    @ApiOperation({ summary: 'Get all payment methods' })
    findAllPaymentMethods() {
        return this.salesService.findAllPaymentMethods();
    }

    @Get('history')
    @ApiOperation({ summary: 'Get detailed sales history for a specific date' })
    @ApiQuery({
        name: 'date',
        required: false,
        description: 'Fecha de búsqueda (YYYY-MM-DD)',
        example: '2026-02-03',
    })
    findHistory(@Query('date') date?: string) {
        const historyDateStr = date || new Date().toISOString().split('T')[0];
        return this.salesService.findHistory(historyDateStr);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a sale by ID' })
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }
}
