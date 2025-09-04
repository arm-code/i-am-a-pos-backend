import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository( Category )
    private readonly categoryRepository: Repository<Category>
  ){}


  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    
    const category = this.categoryRepository.create( createCategoryDto );
    return await  this.categoryRepository.save( category );

  }

  async findAll(): Promise<Category[]> {

    return await this.categoryRepository.find({
      order: {createdAt: 'DESC'}
    });

  }

  async findOne(id: number): Promise<Category> {

    const category = await this.categoryRepository.findOne({ where: { id }})

    if( !category ){
      throw new NotFoundException(`Categoría con Id ${ id } no encontrada.`)
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    
    const category = await this.findOne( id )

    Object.assign( category, updateCategoryDto);

    return await this.categoryRepository.save( category );
  }

  async remove(id: number): Promise<void> {

    const category = await this.findOne( id )
    await this.categoryRepository.remove( category );
  }
}
