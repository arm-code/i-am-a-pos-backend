import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
    
    @ApiPropertyOptional({
        description: 'Código de barras del producto',
        example: '11231234342',
        maxLength: 50
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)    
    codigoBarra?: string;

    @ApiPropertyOptional({
        description: 'Código SKU del producto',
        example: 'MG-8S',
        maxLength: 50
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    sku?: string;

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Mesa grande plegable',
        maxLength: 200,
        minLength: 2
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @MinLength(2)
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del producto',
        example: 'Mesa grande marca lifetime, tipo portafolios'
    })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({
        description: 'Precio en que fue adquirido el producto',
        example: 1200.00,
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    precioCompra: number;

    @ApiProperty({
        description: 'Precio en que se venderá el producto',
        example: 1250.00,
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    precioVenta: number;

    @ApiPropertyOptional({
        description: 'Precio en que se rentará el producto, por día',
        example: 120.00,
        minimum: 0,
        default: 0.0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    @IsOptional()
    precioRentaDiario?: number;

    @ApiPropertyOptional({
        description: 'Total de productos en inventario',
        example: 110,
        minimum: 0,
        default: 0
    })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @IsOptional()
    stock?: number;

    @ApiPropertyOptional({
        description: 'Total de productos permitidos como mínimo en inventario',
        example: 10,
        minimum: 0,
        default: 0
    })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @IsOptional()
    stockMinimo?: number;

    @ApiPropertyOptional({
        description: 'ID de la categoría a la que pertenece el producto',
        example: 2,
        type: Number
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @IsOptional()
    categoriaId?: number;

    @ApiProperty({
        description: 'ID del tipo de producto',
        example: 3,
        type: Number
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    tipoProductoId: number;

    @ApiPropertyOptional({
        description: 'Estado en que se encuentra el producto',
        example: true,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}