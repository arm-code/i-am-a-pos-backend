import { Controller, Post, Get, Body } from '@nestjs/common';
import { PurchasesService } from './services/purchases.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Controller('purchases')
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
