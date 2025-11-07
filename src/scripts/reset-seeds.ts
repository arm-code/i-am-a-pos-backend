// src/scripts/reset-seeds.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function resetSeeds() {
  console.log('🔄 Iniciando reset de seeds...');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.BD_HOST,
    port: Number(process.env.BD_PORT),
    username: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_DATABASENAME,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a la base de datos');

    // SOLO en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      console.log('❌ Reset solo permitido en desarrollo');
      return;
    }

    console.log('🧹 Limpiando datos existentes...');
    
    // ORDEN IMPORTANTE: Primero tablas con foreign keys
    await dataSource.query(`DELETE FROM sale_items`);
    await dataSource.query(`DELETE FROM sales`);
    await dataSource.query(`DELETE FROM rentals`);
    await dataSource.query(`DELETE FROM transactions`);
    await dataSource.query(`DELETE FROM productos`);
    await dataSource.query(`DELETE FROM categorias`);
    await dataSource.query(`DELETE FROM payment_methods`);
    // NO borramos tipos_producto para mantener integridad

    console.log('✅ Datos limpiados, cargando nuevos seeds...');

    // 1. Tipos de Producto (si no existen)
    console.log('🏷️ Insertando tipos de producto...');
    const productTypes = [
      [1, 'Producto Físico', 'Productos tangibles que requieren inventario físico', true, true, false],
      [2, 'Producto Digital', 'Productos digitales como software, eBooks, cursos online', false, true, false],
      [3, 'Servicio', 'Prestación de servicios profesionales o técnicos', false, true, false],
      [4, 'Equipo para Renta', 'Equipos y herramientas disponibles para renta', true, false, true],
      [5, 'Consumible', 'Productos que se consumen o gastan con el uso', true, true, false],
      [6, 'Mixto (Venta/Renta)', 'Productos que pueden venderse o rentarse', true, true, true],
      [7, 'Kit/Paquete', 'Conjunto de productos empaquetados juntos', true, true, false],
    ];

    for (const type of productTypes) {
      await dataSource.query(
        `INSERT INTO tipos_producto (id, nombre, descripcion, requiere_stock, permite_venta, permite_renta, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
         ON CONFLICT (id) DO UPDATE SET
           nombre = EXCLUDED.nombre,
           descripcion = EXCLUDED.descripcion,
           requiere_stock = EXCLUDED.requiere_stock,
           permite_venta = EXCLUDED.permite_venta,
           permite_renta = EXCLUDED.permite_renta`,
        type
      );
    }

    // 2. Categorías
    console.log('📁 Insertando categorías...');
    const categories = [
      ['c1', 'Electrónicos', 'Dispositivos electrónicos y tecnología'],
      ['c2', 'Ropa', 'Prendas de vestir para hombre y mujer'],
      ['c3', 'Hogar', 'Artículos para el hogar'],
      ['c4', 'Deportes', 'Equipo y ropa deportiva'],
    ];

    for (const category of categories) {
      await dataSource.query(
        `INSERT INTO categorias (id, nombre, descripcion, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         ON CONFLICT (id) DO NOTHING`,
        category
      );
    }

    // 3. Métodos de Pago
    console.log('💳 Insertando métodos de pago...');
    const paymentMethods = [
      ['Efectivo', 'Pago en efectivo', true],
      ['Tarjeta de Crédito', 'Pago con tarjeta de crédito', true],
      ['Tarjeta de Débito', 'Pago con tarjeta de débito', true],
      ['Transferencia', 'Transferencia bancaria', true],
      ['Mercado Pago', 'Pago mediante Mercado Pago', true],
    ];

    for (const method of paymentMethods) {
      await dataSource.query(
        `INSERT INTO payment_methods (name, description, is_active) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (name) DO NOTHING`,
        method
      );
    }

    // 4. Productos
    console.log('📦 Insertando productos de ejemplo...');
    const products = [
      ['p1', 'iPhone 14', 'Smartphone Apple iPhone 14 128GB', 15999.00, 15, 'c1', 1],
      ['p2', 'Samsung Galaxy S23', 'Smartphone Samsung Galaxy S23 256GB', 13999.00, 20, 'c1', 1],
      ['p3', 'PlayStation 5', 'Consola de videojuegos PlayStation 5', 12999.00, 8, 'c1', 1],
      ['p4', 'Curso de Programación', 'Curso online de programación en JavaScript', 899.00, 0, 'c1', 2],
      ['p5', 'Camiseta Básica', 'Camiseta de algodón 100% unisex', 199.00, 50, 'c2', 1],
      ['p6', 'Jeans Clásicos', 'Jeans ajustados color azul', 599.00, 30, 'c2', 1],
      ['p7', 'Silla Gamer', 'Silla ergonómica para gaming', 3499.00, 12, 'c3', 1],
      ['p8', 'Cámara Profesional para Renta', 'Cámara DSLR profesional para eventos', 800.00, 5, 'c1', 4],
      ['p9', 'Kit de Herramientas', 'Kit completo de herramientas profesionales', 2500.00, 10, 'c3', 6],
    ];

    for (const product of products) {
      await dataSource.query(
        `INSERT INTO productos (id, nombre, descripcion, precio, stock, categoria_id, tipo_producto_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
         ON CONFLICT (id) DO NOTHING`,
        product
      );
    }

    console.log('🎉 Reset completado exitosamente!');

  } catch (error) {
    console.error('❌ Error en reset:', error);
  } finally {
    await dataSource.destroy();
  }
}

resetSeeds();