import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";


export class CreateProductDto {
    
    @IsString()
    @IsOptional()
    @MaxLength(50)    
    codigoBarras?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    sku?:  string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @MinLength(2)
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsNumber()
    @IsPositive()
    @Min(0)
    @Type( () => Number )
    precioCompra: number;

    @IsNumber()
    @IsPositive()
    @Min(0)
    @Type( () => Number )
    precioVenta: number;

    @IsNumber()
    @IsPositive()
    @Min(0)
    @Type( () => Number )
    @IsOptional()
    precioRentaDiario?: number = 0.0;

    @IsInt()
    @Min(0)
    @Type( () => Number )
    @IsOptional()
    stock?: number = 0

    @IsInt()
    @Min(0)
    @Type( () => Number )
    @IsOptional()
    stockMinimo?: number = 0

    @IsNumber()
    @IsPositive()
    @Type( () => Number )
    @IsOptional()
    categoriaId?: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    tipoProductoId: number;

    @IsBoolean()
    @IsOptional()
    activo?: boolean = true;




}
