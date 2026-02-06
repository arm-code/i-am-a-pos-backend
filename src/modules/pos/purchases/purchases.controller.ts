import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PurchasesService } from './services/purchases.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@ApiTags('Purchases')
@ApiBearerAuth()
@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) { }

    @Post('suppliers')
    async createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
        return await this.purchasesService.createSupplier(createSupplierDto);
    }

    @Get('suppliers')
    async findAllSuppliers() {
        return await this.purchasesService.findAllSuppliers();
    }

    @Post()
    async createPurchase(@Body() createPurchaseDto: CreatePurchaseDto) {
        return await this.purchasesService.createPurchase(createPurchaseDto);
    }

    @Get()
    async findAllPurchases() {
        return await this.purchasesService.findAllPurchases();
    }
}

