import { IsArray, IsNumber, IsPositive, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreatePurchaseItemDto {
    @ApiProperty({
        example: 'uuid-del-producto-1',
        description: 'ID del producto comprado',
    })
    @IsUUID()
    productId: string;

    @ApiProperty({
        example: 10,
        description: 'Cantidad comprada',
    })
    @IsNumber()
    @IsPositive()
    quantity: number;

    @ApiProperty({
        example: 15.50,
        description: 'Costo unitario de compra',
    })
    @IsNumber()
    @IsPositive()
    costPrice: number;
}

export class CreatePurchaseDto {
    @ApiProperty({
        example: 'uuid-del-proveedor',
        description: 'ID del proveedor de la compra',
    })
    @IsUUID()
    supplierId: string;

    @ApiProperty({
        type: [CreatePurchaseItemDto],
        description: 'Lista de productos incluidos en la compra',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseItemDto)
    items: CreatePurchaseItemDto[];
}

