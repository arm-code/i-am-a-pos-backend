import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('corte-caja')
    @ApiOperation({ summary: 'Get daily cash report' })
    getCorteCaja(@Query('date') date?: string) {
        const reportDate = date ? new Date(date) : new Date();
        return this.reportsService.getCorteCaja(reportDate);
    }

    @Get('net-profit')
    @ApiOperation({ summary: 'Get net profit report for a date range' })
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
