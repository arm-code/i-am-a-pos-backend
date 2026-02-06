import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('products')
    @ApiOperation({ summary: 'Create a new product' })
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.inventoryService.createProduct(createProductDto);
    }

    @Get('products')
    @ApiOperation({ summary: 'Get all products (optional search)' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Búsqueda por nombre o código de barras',
        example: 'Coca Cola',
    })
    findAllProducts(@Query('search') search?: string) {
        return this.inventoryService.findAllProducts(search);
    }

    @Get('products/:id')
    @ApiOperation({ summary: 'Get a product by ID' })
    findOneProduct(@Param('id') id: string) {
        return this.inventoryService.findOneProduct(id);
    }

    @Patch('products/:id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update a product' })
    updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.inventoryService.updateProduct(id, updateProductDto);
    }

    @Delete('products/:id')
    @ApiOperation({ summary: 'Delete a product' })
    removeProduct(@Param('id') id: string) {
        return this.inventoryService.removeProduct(id);
    }

    @Patch('products/:id/add-stock')
    @ApiOperation({ summary: 'Add stock to an existing product' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                amount: { type: 'number', example: 50, description: 'Cantidad de stock a sumar' },
                reason: { type: 'string', example: 'Compra a proveedor', description: 'Motivo del ajuste' },
            },
            required: ['amount'],
        },
    })
    addStock(
        @Param('id') id: string,
        @Body('amount') amount: number,
        @Body('reason') reason?: string,
    ) {
        return this.inventoryService.addStock(id, amount, reason);
    }

    @Get('movements')
    @ApiOperation({ summary: 'Get all inventory movements (Audit Log)' })
    findAllMovements() {
        return this.inventoryService.findAllMovements();
    }

    @Post('adjustments')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Register a manual inventory adjustment' })
    registerAdjustment(@Body() createAdjustmentDto: CreateAdjustmentDto) {
        return this.inventoryService.registerAdjustment(createAdjustmentDto);
    }

    @Post('categories')
    @ApiOperation({ summary: 'Create a new category' })
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        const { name, description } = createCategoryDto;
        return this.inventoryService.createCategory(name, description);
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all categories' })
    findAllCategories() {
        return this.inventoryService.findAllCategories();
    }
}

