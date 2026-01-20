import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleNoteItemDto {
    @ApiProperty({ description: 'ID del producto (opcional si es manual)', required: false })
    @IsOptional()
    @IsNumber()
    product_id?: number;

    @ApiProperty({ description: 'Cantidad', example: 2 })
    @IsNumber()
    @Type(() => Number)
    quantity: number;

    @ApiProperty({ description: 'Descripción del servicio o producto', example: 'Servicio de mantenimiento' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Precio unitario', example: 500.00 })
    @IsNumber()
    @Type(() => Number)
    unit_price: number;

    @ApiProperty({ description: 'Importe (cantidad * precio unitario)', example: 1000.00 })
    @IsNumber()
    @Type(() => Number)
    amount: number;
}
