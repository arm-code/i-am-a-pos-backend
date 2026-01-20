import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

    @ApiProperty({
        description: 'Nombre de la categoría',
        example: 'Electrónica',
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @ApiProperty({
        description: 'Descripción de la categoría',
        example: 'Productos electrónicos y accesorios',
        required: false
    })
    @IsString()
    @IsOptional()
    descripcion: string;

}
