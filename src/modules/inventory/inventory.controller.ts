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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('products')
    @ApiOperation({ summary: 'Create a new product' })
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.inventoryService.createProduct(createProductDto);
    }

    @Get('products')
    @ApiOperation({ summary: 'Get all products (optional search)' })
    findAllProducts(@Query('search') search?: string) {
        return this.inventoryService.findAllProducts(search);
    }

    @Get('products/:id')
    @ApiOperation({ summary: 'Get a product by ID' })
    findOneProduct(@Param('id') id: string) {
        return this.inventoryService.findOneProduct(id);
    }

    @Patch('products/:id')
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

    @Post('categories')
    @ApiOperation({ summary: 'Create a new category' })
    createCategory(
        @Body('name') name: string,
        @Body('description') description?: string,
    ) {
        return this.inventoryService.createCategory(name, description);
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all categories' })
    findAllCategories() {
        return this.inventoryService.findAllCategories();
    }
}
