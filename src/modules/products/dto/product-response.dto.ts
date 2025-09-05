import { Exclude, Expose } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity';
import { ProductType } from '../../product-types/entities/product-type.entity';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  codigoBarra: string;

  @Expose()
  sku: string;

  @Expose()
  nombre: string;

  @Expose()
  descripcion: string;

  @Expose()
  precioCompra: number;

  @Expose()
  precioVenta: number;

  @Expose()
  precioRentaDiario: number;

  @Expose()
  stock: number;

  @Expose()
  stockMinimo: number;

  @Expose()
  categoria: Category;

  @Expose()
  tipoProducto: ProductType;

  @Expose()
  activo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}