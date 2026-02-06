import { IsArray, IsNumber, IsPositive, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreatePurchaseItemDto {
    @IsUUID()
    productId: string;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNumber()
    @IsPositive()
    costPrice: number;
}

export class CreatePurchaseDto {
    @IsUUID()
    supplierId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseItemDto)
    items: CreatePurchaseItemDto[];
}

