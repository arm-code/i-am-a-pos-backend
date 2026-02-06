import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateSupplierDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsOptional()
    phone?: string;
}

