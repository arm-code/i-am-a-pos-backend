import { IsNumber, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateAdjustmentDto {
    @IsUUID()
    productId: string;

    @IsNumber()
    quantity: number;

    @IsString()
    @MinLength(3)
    reason: string;
}
