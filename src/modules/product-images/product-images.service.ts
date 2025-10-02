import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private baseDir() {
    return process.env.IMAGES_PATH!;
  }

  private baseUrl() {
    return process.env.IMAGES_BASE_URL!;
  }

  async list(productId: number) {
    return this.imageRepository.find({
      where: { producto: { id: productId } },
      order: { principal: 'DESC', createdAt: 'DESC' },
    });
  }

  async createRecord(
    productId: number,
    filename: string,
    mime: string,
    size: number,
  ) {
    const producto = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!producto) throw new NotFoundException('Producto no encontrado alv!');

    const url = `${this.baseDir()}/productos/${productId}/${filename}`;
    const img = this.imageRepository.create({
      url,
      filename,
      mimeType: mime,
      sizeBytes: size,
      producto: producto,
    });

    return this.imageRepository.save(img);
  }

  async setPrincipal(productId: number, imageId: number) {
    const img = await this.imageRepository.findOne({
      where: { id: imageId, producto: { id: productId } },
    });
    if (!img) throw new NotFoundException('Imagen no encontrada');

    await this.imageRepository.manager.transaction(async (trx) => {
      await trx.update(
        ProductImage,
        { producto: { id: productId } },
        { principal: false },
      );
      await trx.update(ProductImage, { id: imageId }, { principal: true });
    });

    return { success: true };
  }

  async remove(productId: number, imageId: number) {
    const img = await this.imageRepository.findOne({
      where: { id: imageId, producto: { id: productId } },
    });
    if (!img) throw new NotFoundException('Imagen no encontrada');

    const filePath = path.join(
      this.baseDir(),
      'productos',
      String(productId),
      img.filename,
    );
    await fs.rm(filePath, { force: true });
    await this.imageRepository.delete(imageId);
    return { success: true };
  }
}
