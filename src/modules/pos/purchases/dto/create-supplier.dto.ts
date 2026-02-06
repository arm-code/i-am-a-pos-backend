import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
    @ApiProperty({
        example: 'Distribuidora Monterrey S.A. de C.V.',
        description: 'Nombre o razón social del proveedor',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        example: '8112345678',
        description: 'Teléfono de contacto del proveedor',
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;
}

