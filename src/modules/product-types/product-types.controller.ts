import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe, Put } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductType } from './entities/product-type.entity';

@Controller('tipos-producto')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductTypeDto: CreateProductTypeDto
  ): Promise<ProductType> {
    return this.productTypesService.create(createProductTypeDto);
  }

  @Get()
  async findAll(): Promise<ProductType[]> {
    return this.productTypesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductType> {
    return this.productTypesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductTypeDto: UpdateProductTypeDto
  ): Promise<ProductType> {
    return this.productTypesService.update(id, updateProductTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productTypesService.remove(id);
  }
}
