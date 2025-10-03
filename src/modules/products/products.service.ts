// src/products/products.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, ILike, Between, FindOptionsWhere } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Verificar si el SKU ya existe
      if (createProductDto.sku) {
        const existingSku = await this.productRepository.findOne({
          where: { sku: createProductDto.sku }
        });
        if (existingSku) {
          throw new ConflictException(`El SKU ${createProductDto.sku} ya existe`);
        }
      }

      // Verificar si el código de barras ya existe
      if (createProductDto.codigoBarras) {
        const existingCodigoBarras = await this.productRepository.findOne({
          where: { codigoBarra: createProductDto.codigoBarras }
        });
        if (existingCodigoBarras) {
          throw new ConflictException(`El código de barras ${createProductDto.codigoBarras} ya existe`);
        }
      }

      // Validar que precioVenta sea mayor que precioCompra
      if (createProductDto.precioVenta <= createProductDto.precioCompra) {
        throw new BadRequestException('El precio de venta debe ser mayor al precio de compra');
      }

      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);

    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }

  async findAll(filterDto?: ProductFilterDto): Promise<{ products: Product[]; total: number }> {
    try {
      const { 
        search, 
        categoriaId, 
        tipoProductoId, 
        activo, 
        orderBy = 'nombre', 
        order = 'ASC', 
        page = 1, 
        limit = 10 
      } = filterDto || {};

      const where: FindOptionsWhere<Product> = {};

      // Filtros
      if (search) {
        where.nombre = ILike(`%${search}%`);
      }

      if (categoriaId) {
        where.categoria = { id: categoriaId };
      }

      if (tipoProductoId) {
        where.tipoProducto = { id: tipoProductoId };
      }

      if (activo !== undefined) {
        where.activo = activo;
      }

      // Paginación
      const skip = (page - 1) * limit;
      const [products, total] = await this.productRepository.findAndCount({
        where,
        relations: ['categoria', 'tipoProducto', 'imagenes'],
        order: { [orderBy]: order },
        skip,
        take: limit,
      });

      return { products, total };

    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['categoria', 'tipoProducto', 'imagenes']
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el producto');
    }
  }

  async findBySku(sku: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { sku },
        relations: ['categoria', 'tipoProducto']
      });

      if (!product) {
        throw new NotFoundException(`Producto con SKU ${sku} no encontrado`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el producto por SKU');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.findOne(id);

      // Validar SKU único (si se está actualizando)
      if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
        const existingSku = await this.productRepository.findOne({
          where: { sku: updateProductDto.sku }
        });
        if (existingSku) {
          throw new ConflictException(`El SKU ${updateProductDto.sku} ya existe`);
        }
      }

      // Validar código de barras único (si se está actualizando)
      if (updateProductDto.codigoBarras && updateProductDto.codigoBarras !== product.codigoBarra) {
        const existingCodigoBarras = await this.productRepository.findOne({
          where: { codigoBarra: updateProductDto.codigoBarras }
        });
        if (existingCodigoBarras) {
          throw new ConflictException(`El código de barras ${updateProductDto.codigoBarras} ya existe`);
        }
      }

      // Validar precios
      if (updateProductDto.precioVenta !== undefined && updateProductDto.precioCompra !== undefined) {
        if (updateProductDto.precioVenta <= updateProductDto.precioCompra) {
          throw new BadRequestException('El precio de venta debe ser mayor al precio de compra');
        }
      }

      Object.assign(product, updateProductDto);
      return await this.productRepository.save(product);

    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof ConflictException || 
          error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el producto');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el producto');
    }
  }

  async updateStock(id: number, cantidad: number, tipo: 'incrementar' | 'decrementar'): Promise<Product> {
    try {
      const product = await this.findOne(id);

      if (tipo === 'decrementar' && product.stock < cantidad) {
        throw new BadRequestException('Stock insuficiente');
      }

      product.stock = tipo === 'incrementar' 
        ? product.stock + cantidad 
        : product.stock - cantidad;

      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el stock');
    }
  }

  async findLowStock(): Promise<Product[]> {
    try {
      return await this.productRepository
        .createQueryBuilder('product')
        .where('product.stock <= product.stockMinimo')
        .andWhere('product.activo = :activo', { activo: true })
        .leftJoinAndSelect('product.categoria', 'categoria')
        .leftJoinAndSelect('product.tipoProducto', 'tipoProducto')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener productos con stock bajo');
    }
  }

  async deactivate(id: number): Promise<Product> {
    try {
      const product = await this.findOne(id);
      product.activo = false;
      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al desactivar el producto');
    }
  }

  async activate(id: number): Promise<Product> {
    try {
      const product = await this.findOne(id);
      product.activo = true;
      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al activar el producto');
    }
  }
}