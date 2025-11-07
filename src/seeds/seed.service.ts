// src/seeds/seed.service.ts (actualizado)
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { categoriesSeed } from './data/categories.seed';
import { productsSeed } from './data/products.seed';
import { paymentMethodsSeed } from './data/payment-methods.seed';
import { productTypesSeed } from './data/products-types.seed';


@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private dataSource: DataSource) {}

  async runSeeds() {
    this.logger.log('🌱 Iniciando seeds de desarrollo...');

    try {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        
        // 1. Tipos de Producto
        this.logger.log('🏷️ Insertando tipos de producto...');
        for (const typeData of productTypesSeed) {
          await transactionalEntityManager.query(
            `INSERT INTO tipos_producto (id, nombre, descripcion, requiere_stock, permite_venta, permite_renta, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
             ON CONFLICT (id) DO UPDATE SET
               nombre = EXCLUDED.nombre,
               descripcion = EXCLUDED.descripcion,
               requiere_stock = EXCLUDED.requiere_stock,
               permite_venta = EXCLUDED.permite_venta,
               permite_renta = EXCLUDED.permite_renta`,
            [
              typeData.id,
              typeData.nombre,
              typeData.descripcion,
              typeData.requiere_stock,
              typeData.permite_venta,
              typeData.permite_renta
            ]
          );
        }

        // 2. Categorías
        this.logger.log('📁 Insertando categorías...');
        for (const categoryData of categoriesSeed) {
          await transactionalEntityManager.query(
            `INSERT INTO categorias (id, nombre, descripcion, created_at, updated_at) 
             VALUES ($1, $2, $3, NOW(), NOW()) 
             ON CONFLICT (id) DO NOTHING`,
            [categoryData.id, categoryData.nombre, categoryData.descripcion]
          );
        }

        // 3. Métodos de pago
        this.logger.log('💳 Insertando métodos de pago...');
        for (const methodData of paymentMethodsSeed) {
          await transactionalEntityManager.query(
            `INSERT INTO payment_methods (name, description, is_active) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (name) DO NOTHING`,
            [methodData.name, methodData.description, methodData.is_active]
          );
        }

        // 4. Productos de ejemplo
        this.logger.log('📦 Insertando productos de ejemplo...');
        for (const productData of productsSeed) {
          await transactionalEntityManager.query(
            `INSERT INTO productos (id, nombre, descripcion, precio, stock, categoria_id, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
             ON CONFLICT (id) DO NOTHING`,
            [
              productData.id, 
              productData.nombre, 
              productData.descripcion,
              productData.precio,
              productData.stock,
              productData.categoria_id
            ]
          );
        }
      });

      this.logger.log('✅ Seeds ejecutados exitosamente!');
      
    } catch (error) {
      this.logger.error('❌ Error en seeds:', error);
      throw error;
    }
  }

  async clearSeeds() {
    this.logger.log('🧹 Limpiando datos de seeds...');
    
    if (process.env.NODE_ENV === 'development') {
      // NOTA: No limpiamos tipos_producto para mantener la integridad referencial
      await this.dataSource.query(`DELETE FROM productos`);
      await this.dataSource.query(`DELETE FROM categorias`);
      await this.dataSource.query(`DELETE FROM payment_methods WHERE name != 'Efectivo'`);
      this.logger.log('✅ Datos de seeds eliminados (excepto tipos_producto)');
    }
  }
}