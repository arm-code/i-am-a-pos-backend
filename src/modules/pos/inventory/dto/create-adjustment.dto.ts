import { IsNumber, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdjustmentDto {
    @ApiProperty({
        example: 'uuid-del-producto',
        description: 'ID del producto a ajustar stock',
    })
    @IsUUID()
    productId: string;

    @ApiProperty({
        example: -5,
        description: 'Cantidad a ajustar (negativo para restar, positivo para sumar)',
    })
    @IsNumber()
    quantity: number;

    @ApiProperty({
        example: 'Merma por producto caducado',
        description: 'Motivo del ajuste manual',
    })
    @IsString()
    @MinLength(3)
    reason: string;
}

