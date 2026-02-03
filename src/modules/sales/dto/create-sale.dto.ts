import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '../entities/sale.entity';

class SaleItemDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateSaleDto {
    @ApiProperty({ enum: PaymentType })
    @IsEnum(PaymentType)
    @IsNotEmpty()
    paymentType: PaymentType;

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @ApiProperty({ type: [SaleItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];
}
