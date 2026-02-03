import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    barcode: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    purchasePrice: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    sellPrice: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    minStock: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    unit: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    categoryId?: string;
}
