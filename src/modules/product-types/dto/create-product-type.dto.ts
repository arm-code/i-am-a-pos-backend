import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductTypeDto {

    @ApiProperty({
        description: 'Nombre del tipo de producto',
        example: 'Servicio',
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nombre: string;

    @ApiProperty({
        description: 'Descripción del tipo de producto',
        example: 'Servicios profesionales y consultoría',
        required: false
    })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({
        description: 'Indica si este tipo de producto requiere control de stock',
        example: true,
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    requiereStock?: boolean = true;

    @ApiProperty({
        description: 'Indica si este tipo de producto se puede vender',
        example: true,
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    permiteVenta?: boolean = true;

    @ApiProperty({
        description: 'Indica si este tipo de producto se puede rentar',
        example: false,
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    permiteRenta?: boolean = true;
}
