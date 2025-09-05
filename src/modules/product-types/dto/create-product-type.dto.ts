import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductTypeDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength( 50 )
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsBoolean()
    @IsOptional()
    requiereStock?: boolean = true;

    @IsBoolean()
    @IsOptional()
    permiteVenta?: boolean = true;

    @IsBoolean()
    @IsOptional()
    permiteRenta?: boolean = true;
}
