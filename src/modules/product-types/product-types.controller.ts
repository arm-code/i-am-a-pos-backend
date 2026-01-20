import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductType } from './entities/product-type.entity';

@ApiTags('Tipos de Producto')
@Controller('tipos-producto')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo tipo de producto' })
  @ApiBody({ type: CreateProductTypeDto })
  @ApiResponse({ status: 201, description: 'Tipo de producto creado exitosamente', type: ProductType })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body() createProductTypeDto: CreateProductTypeDto
  ): Promise<ProductType> {
    return this.productTypesService.create(createProductTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de producto' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de producto', type: [ProductType] })
  async findAll(): Promise<ProductType[]> {
    return this.productTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del tipo de producto', type: Number })
  @ApiResponse({ status: 200, description: 'Tipo de producto encontrado', type: ProductType })
  @ApiResponse({ status: 404, description: 'Tipo de producto no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductType> {
    return this.productTypesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de producto' })
  @ApiParam({ name: 'id', description: 'ID del tipo de producto', type: Number })
  @ApiResponse({ status: 200, description: 'Tipo de producto actualizado exitosamente', type: ProductType })
  @ApiResponse({ status: 404, description: 'Tipo de producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductTypeDto: UpdateProductTypeDto
  ): Promise<ProductType> {
    return this.productTypesService.update(id, updateProductTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un tipo de producto' })
  @ApiParam({ name: 'id', description: 'ID del tipo de producto', type: Number })
  @ApiResponse({ status: 204, description: 'Tipo de producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tipo de producto no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productTypesService.remove(id);
  }
}
