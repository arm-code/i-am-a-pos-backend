import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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

    @Get(':id')
    @ApiOperation({ summary: 'Get a sale by ID' })
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }
}
