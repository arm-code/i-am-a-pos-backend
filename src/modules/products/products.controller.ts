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
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody, 
  ApiQuery,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Product } from './entities/product.entity';

@ApiTags('productos')
@Controller('productos')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo producto',
    description: 'Crea un nuevo producto en el sistema con toda la información requerida'
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Producto creado exitosamente',
    type: ProductResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflicto - SKU o código de barras ya existe' 
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return new ProductResponseDto(product);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener listado de productos',
    description: 'Obtiene una lista paginada de productos con opciones de filtrado'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados por página', example: 10 })
  @ApiQuery({ name: 'nombre', required: false, description: 'Filtrar por nombre', example: 'laptop' })
  @ApiQuery({ name: 'categoriaId', required: false, type: Number, description: 'Filtrar por categoría ID', example: 1 })
  @ApiQuery({ name: 'tipoProductoId', required: false, type: Number, description: 'Filtrar por tipo de producto ID', example: 2 })
  @ApiQuery({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por estado activo', example: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de productos obtenida exitosamente',
    schema: {
      properties: {
        products: {
          type: 'array',
          items: { $ref: getSchemaPath(ProductResponseDto) }
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Obtener producto por ID',
    description: 'Obtiene la información completa de un producto específico por su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del producto', 
    type: Number,
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto encontrado',
    type: ProductResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Producto no encontrado' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return new ProductResponseDto(product);
  }

  @Get('sku/:sku')
  @ApiOperation({ 
    summary: 'Obtener producto por SKU',
    description: 'Obtiene la información completa de un producto específico por su SKU'
  })
  @ApiParam({ 
    name: 'sku', 
    description: 'SKU del producto', 
    type: String,
    example: 'PROD-001-2024' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto encontrado',
    type: ProductResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Producto no encontrado' 
  })
  async findBySku(@Param('sku') sku: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findBySku(sku);
    return new ProductResponseDto(product);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar producto',
    description: 'Actualiza la información de un producto existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del producto a actualizar', 
    type: Number,
    example: 1 
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto actualizado exitosamente',
    type: ProductResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Producto no encontrado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return new ProductResponseDto(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar producto',
    description: 'Elimina permanentemente un producto del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del producto a eliminar', 
    type: Number,
    example: 1 
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Producto eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Producto no encontrado' 
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productsService.remove(id);
  }

  @Patch(':id/stock')
  @ApiOperation({ 
    summary: 'Actualizar stock',
    description: 'Incrementa o decrementa el stock de un producto'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del producto', 
    type: Number,
    example: 1 
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        cantidad: { type: 'number', example: 5, description: 'Cantidad a incrementar/decrementar' },
        tipo: { type: 'string', enum: ['incrementar', 'decrementar'], example: 'incrementar' }
      },
      required: ['cantidad', 'tipo']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock actualizado exitosamente',
    type: ProductResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Producto no encontrado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Stock insuficiente para decrementar' 
  })
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
  @ApiOperation({ 
    summary: 'Productos con stock bajo',
    description: 'Obtiene los productos que están por debajo de su stock mínimo'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de productos con stock bajo',
    type: [ProductResponseDto] 
  })
  async findLowStock(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findLowStock();
    return products.map(product => new ProductResponseDto(product));
  }

  @Patch(':id/activar')
  @ApiOperation({ 
    summary: 'Activar producto',
    description: 'Activa un producto que estaba desactivado'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del producto a activar', 
    type: Number,
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto activado exitosamente',
    type: ProductResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Producto no encontrado' 
  })
  async activate(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.activate(id);
    return new ProductResponseDto(product);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ 
    summary: 'Desactivar producto',
    description: 'Desactiva un producto (no lo elimina, solo cambia su estado)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del producto a desactivar', 
    type: Number,
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto desactivado exitosamente',
    type: ProductResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Producto no encontrado' 
  })
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.deactivate(id);
    return new ProductResponseDto(product);
  }

  @Get('categoria/:categoriaId')
  @ApiOperation({ 
    summary: 'Productos por categoría',
    description: 'Obtiene productos filtrados por categoría con paginación'
  })
  @ApiParam({ 
    name: 'categoriaId', 
    description: 'ID de la categoría', 
    type: Number,
    example: 1 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados por página', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Productos de la categoría obtenidos exitosamente',
    schema: {
      properties: {
        products: {
          type: 'array',
          items: { $ref: getSchemaPath(ProductResponseDto) }
        },
        total: { type: 'number', example: 25 }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoría no encontrada' 
  })
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
  @ApiOperation({ 
    summary: 'Productos por tipo',
    description: 'Obtiene productos filtrados por tipo de producto con paginación'
  })
  @ApiParam({ 
    name: 'tipoProductoId', 
    description: 'ID del tipo de producto', 
    type: Number,
    example: 2 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados por página', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Productos del tipo obtenidos exitosamente',
    schema: {
      properties: {
        products: {
          type: 'array',
          items: { $ref: getSchemaPath(ProductResponseDto) }
        },
        total: { type: 'number', example: 15 }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tipo de producto no encontrado' 
  })
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