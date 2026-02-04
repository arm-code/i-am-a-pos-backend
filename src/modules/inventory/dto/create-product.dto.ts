import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        example: 'Coca Cola 600ml',
        description: 'Nombre del producto',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Refresco de cola en botella de plástico',
        description: 'Descripción opcional del producto',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: '7501055300074',
        description: 'Código de barras único',
    })
    @IsString()
    @IsNotEmpty()
    barcode: string;

    @ApiProperty({
        example: 12.5,
        description: 'Precio de compra al proveedor',
    })
    @IsNumber()
    @Min(0)
    purchasePrice: number;

    @ApiProperty({
        example: 18.0,
        description: 'Precio de venta al público',
    })
    @IsNumber()
    @Min(0)
    sellPrice: number;

    @ApiProperty({
        example: 100,
        description: 'Stock actual disponible',
    })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({
        example: 10,
        description: 'Stock mínimo para alertas',
    })
    @IsNumber()
    @Min(0)
    minStock: number;

    @ApiProperty({
        example: 'Pza',
        description: 'Unidad de medida (Pza, Kg, L, etc.)',
    })
    @IsString()
    @IsNotEmpty()
    unit: string;

    @ApiProperty({
        example: 'uuid-de-la-categoria',
        description: 'ID de la categoría a la que pertenece',
        required: false,
    })
    @IsString()
    @IsOptional()
    categoryId?: string;
}
