import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTypesService {

  constructor(
    @InjectRepository( ProductType )
    private readonly productTypeRepository: Repository<ProductType>
  ){}

  async create(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
    const productType = this.productTypeRepository.create( createProductTypeDto );
    return await this.productTypeRepository.save( productType );
  }

  async findAll(): Promise<ProductType[]> {

    return await this.productTypeRepository.find();
  }

  async findOne(id: number): Promise<ProductType> {

    const productType = await this.productTypeRepository.findOne({ where: { id }})

    if(!productType){
      throw new NotFoundException(`Tipo de producto con Id ${ id } no encontrado.`)
    }
    return productType;
  }

  async update(id: number, updateProductTypeDto: UpdateProductTypeDto): Promise<ProductType> {

    const productType = await this.findOne( id )
    Object.assign( productType, updateProductTypeDto )
    return await this.productTypeRepository.save( productType );
  }

  async remove(id: number): Promise<void> {
    const productType = await this.findOne( id )
    await this.productTypeRepository.remove( productType )
  }
}
