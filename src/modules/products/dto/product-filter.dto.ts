import { IsOptional, IsString, IsNumber, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoriaId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tipoProductoId?: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  activo?: boolean;

  @IsString()
  @IsOptional()
  @IsIn(['nombre', 'precioVenta', 'stock', 'createdAt'])
  orderBy?: string = 'nombre';

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: string = 'ASC';

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}