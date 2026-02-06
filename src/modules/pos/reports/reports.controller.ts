import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('corte-caja')
    @ApiOperation({ summary: 'Get daily cash report' })
    @ApiQuery({
        name: 'date',
        required: false,
        description: 'Fecha del corte (YYYY-MM-DD)',
        example: '2026-02-03',
    })
    getCorteCaja(@Query('date') date?: string) {
        const reportDateStr = date || new Date().toISOString().split('T')[0];
        return this.reportsService.getCorteCaja(reportDateStr);
    }

    @Get('net-profit')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get net profit report' })
    @ApiQuery({
        name: 'date',
        required: false,
        description: 'Fecha del reporte (YYYY-MM-DD)',
        example: '2026-02-03',
    })
    getDayProfit(
        @Query('date') date?: string,
    ) {
        const reportDateStr = date || new Date().toISOString().split('T')[0];
        return this.reportsService.getDayProfitQueryBuilder(reportDateStr);
    }

    @Get('shift-expenses')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get total expenses for a shift' })
    @ApiQuery({
        name: 'shiftId',
        required: true,
        description: 'ID del turno',
    })
    getShiftExpenses(@Query('shiftId') shiftId: string) {
        return this.reportsService.getShiftExpenses(shiftId);
    }
}

