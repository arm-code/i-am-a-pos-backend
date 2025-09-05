// src/products/products.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe, 
  HttpCode, 
  HttpStatus,
  DefaultValuePipe,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('productos')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return new ProductResponseDto(product);
  }

  @Get()
  async findAll(
    @Query() filterDto: ProductFilterDto
  ): Promise<{ 
    products: ProductResponseDto[]; 
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.productsService.findAll(filterDto);
    
    return {
      products: result.products.map(product => new ProductResponseDto(product)),
      total: result.total,
      page: filterDto.page || 1,
      limit: filterDto.limit || 10,
      totalPages: Math.ceil(result.total / (filterDto.limit || 10))
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return new ProductResponseDto(product);
  }

  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findBySku(sku);
    return new ProductResponseDto(product);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return new ProductResponseDto(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productsService.remove(id);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: { cantidad: number; tipo: 'incrementar' | 'decrementar' }
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.updateStock(
      id, 
      updateStockDto.cantidad, 
      updateStockDto.tipo
    );
    return new ProductResponseDto(product);
  }

  @Get('stock/bajo')
  async findLowStock(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findLowStock();
    return products.map(product => new ProductResponseDto(product));
  }

  @Patch(':id/activar')
  async activate(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.activate(id);
    return new ProductResponseDto(product);
  }

  @Patch(':id/desactivar')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.deactivate(id);
    return new ProductResponseDto(product);
  }

  @Get('categoria/:categoriaId')
  async findByCategory(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<{ products: ProductResponseDto[]; total: number }> {
    const result = await this.productsService.findAll({ 
      categoriaId, 
      page, 
      limit 
    } as ProductFilterDto);
    
    return {
      products: result.products.map(product => new ProductResponseDto(product)),
      total: result.total
    };
  }

  @Get('tipo/:tipoProductoId')
  async findByProductType(
    @Param('tipoProductoId', ParseIntPipe) tipoProductoId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<{ products: ProductResponseDto[]; total: number }> {
    const result = await this.productsService.findAll({ 
      tipoProductoId, 
      page, 
      limit 
    } as ProductFilterDto);
    
    return {
      products: result.products.map(product => new ProductResponseDto(product)),
      total: result.total
    };
  }
}