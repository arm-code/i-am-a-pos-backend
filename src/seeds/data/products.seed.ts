// src/seeds/data/products.seed.ts (actualizado)
export const productsSeed = [
  {
    id: 1,
    nombre: 'iPhone 14',
    descripcion: 'Smartphone Apple iPhone 14 128GB',
    precio: 15999.00,
    stock: 15,
    categoria_id: 'c1',
    tipo_producto_id: 1 // Producto Físico
  },
  {
    id: 2,
    nombre: 'Samsung Galaxy S23',
    descripcion: 'Smartphone Samsung Galaxy S23 256GB',
    precio: 13999.00,
    stock: 20,
    categoria_id: 'c1',
    tipo_producto_id: 1 // Producto Físico
  },
  {
    id: 3,
    nombre: 'PlayStation 5',
    descripcion: 'Consola de videojuegos PlayStation 5',
    precio: 12999.00,
    stock: 8,
    categoria_id: 'c1',
    tipo_producto_id: 1 // Producto Físico
  },
  {
    id: 4,
    nombre: 'Curso de Programación',
    descripcion: 'Curso online de programación en JavaScript',
    precio: 899.00,
    stock: 0,
    categoria_id: 'c1',
    tipo_producto_id: 2 // Producto Digital
  },
  {
    id: 5,
    nombre: 'Camiseta Básica',
    descripcion: 'Camiseta de algodón 100% unisex',
    precio: 199.00,
    stock: 50,
    categoria_id: 'c2',
    tipo_producto_id: 1 // Producto Físico
  },
  {
    id: 6,
    nombre: 'Jeans Clásicos',
    descripcion: 'Jeans ajustados color azul',
    precio: 599.00,
    stock: 30,
    categoria_id: 'c2',
    tipo_producto_id: 1 // Producto Físico
  },
  {
    id: 7,
    nombre: 'Silla Gamer',
    descripcion: 'Silla ergonómica para gaming',
    precio: 3499.00,
    stock: 12,
    categoria_id: 'c3',
    tipo_producto_id: 1 // Producto Físico
  },
  {
    id: 8,
    nombre: 'Cámara Profesional para Renta',
    descripcion: 'Cámara DSLR profesional para eventos',
    precio: 800.00, // Precio por día de renta
    stock: 5,
    categoria_id: 'c1',
    tipo_producto_id: 4 // Equipo para Renta
  },
  {
    id: 9,
    nombre: 'Kit de Herramientas',
    descripcion: 'Kit completo de herramientas profesionales',
    precio: 2500.00,
    stock: 10,
    categoria_id: 'c3',
    tipo_producto_id: 6 // Mixto (Venta/Renta)
  }
];