import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Category } from 'src/modules/categories/entities/category.entity';
import { ProductType } from 'src/modules/product-types/entities/product-type.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const categoryRepository = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const productTypeRepository = app.get<Repository<ProductType>>(
    getRepositoryToken(ProductType),
  );
  const productRepository = app.get<Repository<Product>>(
    getRepositoryToken(Product),
  );

  // Helpers idempotentes, esto asegura antes de insertar el seed que no haya datos en la database.
  const ensureCategory = async (nombre: string, descripcion?: string) => {
    await categoryRepository.upsert({ nombre, descripcion }, ['nombre']);
    return await categoryRepository.findOneOrFail({ where: { nombre } });
  };

  const ensureType = async (nombre: string, data: Partial<ProductType>) => {
    // ProductType.nombre es UNIQUE, podemos usar upsert
    await productTypeRepository.upsert({ nombre, ...data }, ['nombre']);
    const found = await productTypeRepository.findOneOrFail({
      where: { nombre },
    });
    console.log(`+ tipo_producto: ${found.nombre}`);
    return found;
  };

  const ensureProduct = async (sku: string, data: Partial<Product>) => {
    let found = await productRepository.findOne({ where: { sku } });
    if (!found) {
      found = await productRepository.save(
        productRepository.create({ sku, ...data }),
      );
      console.log(`+ producto: ${found.nombre} (${sku})`);
    }
    return found;
  };

  // 1) Semilla de CATEGORÍAS
  const accesorios = await ensureCategory(
    'Accesorios',
    'Guantes, cinturones, etc.',
  );
  const suplementos = await ensureCategory(
    'Suplementos',
    'Proteínas, creatina, etc.',
  );
  const ropa = await ensureCategory(
    'Ropa deportiva',
    'Playeras, pants, shorts',
  );
  const equipos = await ensureCategory(
    'Equipos',
    'Mancuernas, barras, máquinas',
  );

  // 2) Semilla de TIPOS DE PRODUCTO
  const tipoFisico = await ensureType('Producto físico', {
    descripcion: 'Se vende y requiere stock',
    requiereStock: true,
    permiteVenta: true,
    permiteRenta: false,
  });

  const tipoServicio = await ensureType('Servicio', {
    descripcion: 'Membresías o clases',
    requiereStock: false,
    permiteVenta: true,
    permiteRenta: false,
  });

  const tipoRenta = await ensureType('Renta equipo', {
    descripcion: 'Equipamiento para rentar',
    requiereStock: true,
    permiteVenta: false,
    permiteRenta: true,
  });

  // 3) Semilla de PRODUCTOS
  await ensureProduct('PROT-001', {
    codigoBarra: '7501001234567',
    nombre: 'Proteína Whey 2lb',
    descripcion: 'Proteína sabor vainilla',
    precioCompra: 400.0,
    precioVenta: 650.0,
    precioRentaDiario: 0,
    stock: 20,
    stockMinimo: 5,
    categoria: suplementos,
    tipoProducto: tipoFisico,
    activo: true,
  });

  await ensureProduct('GUA-001', {
    codigoBarra: '7501009876543',
    nombre: 'Guantes de gimnasio',
    descripcion: 'Talla M',
    precioCompra: 150.0,
    precioVenta: 250.0,
    precioRentaDiario: 0,
    stock: 30,
    stockMinimo: 5,
    categoria: accesorios,
    tipoProducto: tipoFisico,
    activo: true,
  });

  await ensureProduct('MEMB-001', {
    nombre: 'Membresía mensual',
    descripcion: 'Acceso a todas las áreas',
    precioCompra: 0,
    precioVenta: 500.0,
    precioRentaDiario: 0,
    stock: 0,
    stockMinimo: 0,
    categoria: null, // es un servicio
    tipoProducto: tipoServicio,
    activo: true,
  });

  await ensureProduct('RENT-BICI', {
    nombre: 'Bicicleta estática',
    descripcion: 'Renta por día',
    precioCompra: 2000.0,
    precioVenta: 0,
    precioRentaDiario: 150.0,
    stock: 5,
    stockMinimo: 1,
    categoria: equipos,
    tipoProducto: tipoRenta,
    activo: true,
  });

  console.log('✅ Seed completado.');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Seed falló:', err);
  process.exit(1);
});
