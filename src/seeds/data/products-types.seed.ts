// src/seeds/data/product-types.seed.ts
export const productTypesSeed = [
  {
    id: 1,
    nombre: 'Producto Físico',
    descripcion: 'Productos tangibles que requieren inventario físico',
    requiere_stock: true,
    permite_venta: true,
    permite_renta: false
  },
  {
    id: 2,
    nombre: 'Producto Digital',
    descripcion: 'Productos digitales como software, eBooks, cursos online',
    requiere_stock: false,
    permite_venta: true,
    permite_renta: false
  },
  {
    id: 3,
    nombre: 'Servicio',
    descripcion: 'Prestación de servicios profesionales o técnicos',
    requiere_stock: false,
    permite_venta: true,
    permite_renta: false
  },
  {
    id: 4,
    nombre: 'Equipo para Renta',
    descripcion: 'Equipos y herramientas disponibles para renta',
    requiere_stock: true,
    permite_venta: false,
    permite_renta: true
  },
  {
    id: 5,
    nombre: 'Consumible',
    descripcion: 'Productos que se consumen o gastan con el uso',
    requiere_stock: true,
    permite_venta: true,
    permite_renta: false
  },
  {
    id: 6,
    nombre: 'Mixto (Venta/Renta)',
    descripcion: 'Productos que pueden venderse o rentarse',
    requiere_stock: true,
    permite_venta: true,
    permite_renta: true
  },
  {
    id: 7,
    nombre: 'Kit/Paquete',
    descripcion: 'Conjunto de productos empaquetados juntos',
    requiere_stock: true,
    permite_venta: true,
    permite_renta: false
  }
];