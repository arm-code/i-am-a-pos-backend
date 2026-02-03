import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SaleItemDto {
    @ApiProperty({
        example: 'uuid-del-producto',
        description: 'ID del producto a vender',
    })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({
        example: 2.5,
        description: 'Cantidad a vender (soporta decimales para peso)',
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateSaleDto {
    @ApiProperty({
        example: 'uuid-del-metodo-pago',
        description: 'ID del método de pago (Efectivo, Tarjeta, Crédito)',
    })
    @IsUUID()
    @IsNotEmpty()
    paymentMethodId: string;

    @ApiProperty({
        example: 'uuid-del-cliente',
        description: 'ID del cliente (obligatorio si el método es Crédito)',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @ApiProperty({
        type: [SaleItemDto],
        description: 'Lista de productos en la venta',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];
}
