import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Bebidas',
        description: 'Nombre de la categoría',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Refrescos, jugos y aguas gaseosas',
        description: 'Descripción detallada de la categoría',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}
