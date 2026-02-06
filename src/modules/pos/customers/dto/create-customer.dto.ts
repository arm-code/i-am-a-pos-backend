import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({
        example: 'María García',
        description: 'Nombre completo del cliente',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '5559876543',
        description: 'Teléfono de contacto del cliente',
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        example: 0,
        description: 'Saldo inicial de deuda/crédito del cliente',
        required: false,
        default: 0,
    })
    @IsNumber()
    @IsOptional()
    balance?: number;
}

