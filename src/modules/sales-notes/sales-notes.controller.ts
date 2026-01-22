import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { SalesNotesService } from './sales-notes.service';
import { CreateSaleNoteDto } from './dto/create-sale-note.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SaleNote } from './entities/sale-note.entity';

@ApiTags('Sales Notes')
@Controller('sales-notes')
export class SalesNotesController {
    constructor(private readonly salesNotesService: SalesNotesService) { }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva nota de venta' })
    @ApiResponse({ status: 201, description: 'Nota de venta creada exitosamente', type: SaleNote })
    create(@Body() createSaleNoteDto: CreateSaleNoteDto) {
        return this.salesNotesService.create(createSaleNoteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas las notas de venta' })
    @ApiResponse({ status: 200, description: 'Lista de notas de venta', type: [SaleNote] })
    findAll() {
        return this.salesNotesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener detalle de una nota de venta' })
    @ApiResponse({ status: 200, description: 'Detalle de la nota de venta', type: SaleNote })
    @ApiResponse({ status: 404, description: 'Nota de venta no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.salesNotesService.findOne(id);
    }
}
