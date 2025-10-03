import { Exclude, Expose, Transform } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity';
import { ProductType } from '../../product-types/entities/product-type.entity';
import { ProductImage } from 'src/modules/product-images/entities/product-image.entity';

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
  categoria: Category | null;

  @Expose()
  tipoProducto: ProductType;

  @Expose()
  activo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => {
    const principal = obj.imagenes?.find((img: ProductImage) => img.principal);
    return principal ? principal.url : (obj.imagenes?.[0]?.url ?? null);
  })
  imagenPrincipal: string | null;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}