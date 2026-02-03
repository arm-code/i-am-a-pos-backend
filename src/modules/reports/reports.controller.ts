import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('corte-caja')
    @ApiOperation({ summary: 'Get daily cash report' })
    @ApiQuery({
        name: 'date',
        required: false,
        description: 'Fecha del corte (YYYY-MM-DD)',
        example: '2024-02-03',
    })
    getCorteCaja(@Query('date') date?: string) {
        const reportDate = date ? new Date(date) : new Date();
        return this.reportsService.getCorteCaja(reportDate);
    }

    @Get('net-profit')
    @ApiOperation({ summary: 'Get net profit report for a date range' })
    @ApiQuery({
        name: 'startDate',
        required: true,
        description: 'Fecha inicial (YYYY-MM-DD)',
        example: '2024-02-01',
    })
    @ApiQuery({
        name: 'endDate',
        required: true,
        description: 'Fecha final (YYYY-MM-DD)',
        example: '2024-02-29',
    })
    getNetProfit(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.reportsService.getNetProfit(
            new Date(startDate),
            new Date(endDate),
        );
    }
}
