// src/finance/controllers/finance.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe, 
  HttpStatus, 
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FinanceService } from '../services/finance.service';
import { SaleService } from '../services/sale.service';
import { RentalService } from '../services/rental.service';
import { TransactionService } from '../services/transaction.service';
import { CreateCompleteSaleDto } from '../dto/create/create-complete-sale.dto';
import { CreateRentalDto } from '../dto/create/create-rental.dto';
import { Sale } from '../entities/sale.entity';
import { Rental } from '../entities/rental.entity';

@ApiTags('Finance')
@Controller('finance')
@UseInterceptors(ClassSerializerInterceptor)
export class FinanceController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly saleService: SaleService,
    private readonly rentalService: RentalService,
    private readonly transactionService: TransactionService,
  ) {}

  // ==================== SALES ENDPOINTS ====================

  @Post('sales')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una venta completa' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente', type: Sale })
  @ApiResponse({ status: 400, description: 'Datos de venta inválidos' })
  async createSale(@Body() createCompleteSaleDto: CreateCompleteSaleDto): Promise<Sale> {
    return await this.saleService.createCompleteSale(createCompleteSaleDto);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Lista de ventas', type: [Sale] })
  async getSales(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    if (startDate && endDate) {
      return await this.saleService.getSalesByDateRange(startDate, endDate);
    }
    return await this.saleService.findAll();
  }

  @Get('sales/:id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiResponse({ status: 200, description: 'Venta encontrada', type: Sale })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  async getSale(@Param('id', ParseIntPipe) id: number): Promise<Sale> {
    return await this.saleService.findOne(id);
  }

  @Post('sales/:id/cancel')
  @ApiOperation({ summary: 'Cancelar una venta' })
  @ApiResponse({ status: 200, description: 'Venta cancelada exitosamente', type: Sale })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  async cancelSale(@Param('id', ParseIntPipe) id: number): Promise<Sale> {
    return await this.saleService.cancelSale(id);
  }

  @Get('sales/reports/daily')
  @ApiOperation({ summary: 'Obtener reporte de ventas diarias' })
  async getDailySalesReport() {
    return await this.saleService.getDailySales();
  }

  // ==================== RENTALS ENDPOINTS ====================

  @Post('rentals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una renta' })
  @ApiResponse({ status: 201, description: 'Renta creada exitosamente', type: Rental })
  @ApiResponse({ status: 400, description: 'Datos de renta inválidos' })
  async createRental(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return await this.rentalService.createRental(createRentalDto);
  }

  @Get('rentals')
  @ApiOperation({ summary: 'Obtener todas las rentas' })
  @ApiResponse({ status: 200, description: 'Lista de rentas', type: [Rental] })
  async getRentals(): Promise<Rental[]> {
    return await this.rentalService.findAll();
  }

  @Get('rentals/:id')
  @ApiOperation({ summary: 'Obtener una renta por ID' })
  @ApiResponse({ status: 200, description: 'Renta encontrada', type: Rental })
  @ApiResponse({ status: 404, description: 'Renta no encontrada' })
  async getRental(@Param('id', ParseIntPipe) id: number): Promise<Rental> {
    return await this.rentalService.findOne(id);
  }

  @Post('rentals/:id/complete')
  @ApiOperation({ summary: 'Completar una renta' })
  @ApiResponse({ status: 200, description: 'Renta completada exitosamente', type: Rental })
  @ApiResponse({ status: 404, description: 'Renta no encontrada' })
  async completeRental(@Param('id', ParseIntPipe) id: number): Promise<Rental> {
    return await this.rentalService.completeRental(id);
  }

  @Get('rentals/active')
  @ApiOperation({ summary: 'Obtener rentas activas' })
  async getActiveRentals(): Promise<Rental[]> {
    return await this.rentalService.getActiveRentals();
  }

  @Get('rentals/overdue')
  @ApiOperation({ summary: 'Obtener rentas vencidas' })
  async getOverdueRentals(): Promise<Rental[]> {
    return await this.rentalService.getOverdueRentals();
  }

  // ==================== FINANCIAL REPORTS ====================

  @Get('reports/summary')
  @ApiOperation({ summary: 'Obtener resumen financiero' })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  async getFinancialSummary(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.financeService.getFinancialSummary(startDate, endDate);
  }

  @Get('reports/rental-revenue')
  @ApiOperation({ summary: 'Calcular ingresos por rentas en un período' })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  async getRentalRevenue(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ): Promise<number> {
    return await this.rentalService.calculateRentalRevenue(startDate, endDate);
  }

  // ==================== TRANSACTIONS ENDPOINTS ====================

  @Get('transactions')
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  async getTransactions() {
    return await this.transactionService.findAll();
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  async getTransaction(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionService.findOne(id);
  }
}