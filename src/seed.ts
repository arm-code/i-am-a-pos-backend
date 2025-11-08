// src/seed.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

// Entidades (rutas según tu estructura de módulos)
import { Category } from './modules/categories/entities/category.entity';
import { ProductType } from './modules/product-types/entities/product-type.entity';
import { PaymentMethod } from './finance/entities/payment-method.entity';
// Si quieres agregar productos después, descomenta cuando tengamos campos confirmados:
// import { Product } from './modules/products/entities/product.entity';

async function seed() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'], // evita ruido
  });

  const dataSource = appContext.get(DataSource);

  try {
    // ========================================================================
    // 1) CATEGORÍAS
    // ========================================================================
    const categoriesRepo = dataSource.getRepository(Category);
    const categoryData: Partial<Category>[] = [
      { nombre: 'Sillas', descripcion: 'Sillas plegables y apilables' },
      { nombre: 'Mesas', descripcion: 'Mesas rectangulares y redondas' },
      { nombre: 'Carpas', descripcion: 'Carpas y toldos para eventos' },
      { nombre: 'Accesorios', descripcion: 'Complementos y misceláneos' },
    ];

    for (const c of categoryData) {
      const exists = await categoriesRepo.findOne({ where: { nombre: c.nombre } });
      if (!exists) {
        await categoriesRepo.save(categoriesRepo.create(c));
        console.log(`✔ Categoria creada: ${c.nombre}`);
      } else {
        console.log(`↷ Categoria ya existe: ${c.nombre}`);
      }
    }

    // ========================================================================
    // 2) TIPOS DE PRODUCTO
    // ========================================================================
    const productTypesRepo = dataSource.getRepository(ProductType);
    const productTypeData: Partial<ProductType>[] = [
      {
        nombre: 'Inventariable',
        descripcion: 'Requiere stock, puede venderse y rentarse',
        requiereStock: true,
        permiteVenta: true,
        permiteRenta: true,
      },
      {
        nombre: 'Servicio',
        descripcion: 'No requiere stock, solo venta',
        requiereStock: false,
        permiteVenta: true,
        permiteRenta: false,
      },
      {
        nombre: 'Renta',
        descripcion: 'Requiere stock y solo renta',
        requiereStock: true,
        permiteVenta: false,
        permiteRenta: true,
      },
    ];

    for (const t of productTypeData) {
      const exists = await productTypesRepo.findOne({ where: { nombre: t.nombre } });
      if (!exists) {
        await productTypesRepo.save(productTypesRepo.create(t));
        console.log(`✔ Tipo de producto creado: ${t.nombre}`);
      } else {
        console.log(`↷ Tipo de producto ya existe: ${t.nombre}`);
      }
    }

    // ========================================================================
    // 3) MÉTODOS DE PAGO
    // ========================================================================
    const paymentMethodRepo = dataSource.getRepository(PaymentMethod);
    const paymentMethodData: Partial<PaymentMethod>[] = [
      { name: 'Efectivo', description: 'Pago en efectivo', is_active: true },
      { name: 'Tarjeta', description: 'Tarjeta de crédito/débito', is_active: true },
      { name: 'Transferencia', description: 'SPEI / transferencia bancaria', is_active: true },
    ];

    for (const pm of paymentMethodData) {
      const exists = await paymentMethodRepo.findOne({ where: { name: pm.name } });
      if (!exists) {
        await paymentMethodRepo.save(paymentMethodRepo.create(pm));
        console.log(`✔ Método de pago creado: ${pm.name}`);
      } else {
        console.log(`↷ Método de pago ya existe: ${pm.name}`);
      }
    }

    // ========================================================================
    // 4) (OPCIONAL) PRODUCTOS
    // ------------------------------------------------------------------------
    // ⚠ No incluyo productos todavía porque tu `Product` .entity.ts
    // no está completo en el archivo adjunto y no quiero fallar por columnas.
    // En cuanto me confirmes los campos obligatorios (p. ej. nombre, sku, precio_venta,
    // stock, product_type_id, category_id, etc.), activo esta sección.
    // ------------------------------------------------------------------------
    /*
    const productsRepo = dataSource.getRepository(Product);
    const anyCategory = await categoriesRepo.findOne({ where: { nombre: 'Sillas' } });
    const anyType = await productTypesRepo.findOne({ where: { nombre: 'Inventariable' } });

    const productData: Partial<Product>[] = [
      {
        nombre: 'Silla plegable acero',
        descripcion: 'Silla resistente para eventos',
        // sku: 'SIL-PLG-ACR-001',
        // precioVenta: 100,
        // stock: 50,
        // categoryId: anyCategory?.id,
        // productTypeId: anyType?.id,
        // ...ajusta los nombres de columnas reales
      },
      {
        nombre: 'Mesa rectangular 6ft',
        descripcion: 'Mesa para banquete',
        // sku: 'MSA-RECT-6FT-001',
        // precioVenta: 450,
        // stock: 20,
        // categoryId: (await categoriesRepo.findOne({ where: { nombre: 'Mesas' } }))?.id,
        // productTypeId: anyType?.id,
      },
    ];

    for (const p of productData) {
      const exists = await productsRepo.findOne({ where: { nombre: p.nombre as string } });
      if (!exists) {
        await productsRepo.save(productsRepo.create(p));
        console.log(`✔ Producto creado: ${p.nombre}`);
      } else {
        console.log(`↷ Producto ya existe: ${p.nombre}`);
      }
    }
    */

    console.log('🎉 Seeds ejecutados correctamente.');
  } catch (err) {
    console.error('❌ Error ejecutando seeds:', err);
    process.exitCode = 1;
  } finally {
    await appContext.close();
  }
}

seed();
