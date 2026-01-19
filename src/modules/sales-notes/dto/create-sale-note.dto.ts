import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleNoteItemDto } from './create-sale-note-item.dto';

export class CreateSaleNoteDto {
    @ApiProperty({ description: 'Número de nota de venta', example: 'NV-0001' })
    @IsString()
    @IsNotEmpty()
    note_number: string;

    @ApiProperty({ description: 'Fecha de la nota', required: false })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
    @IsString()
    @IsNotEmpty()
    client_name: string;

    @ApiProperty({ description: 'Teléfono del cliente', required: false })
    @IsOptional()
    @IsString()
    client_phone?: string;

    @ApiProperty({ description: 'Dirección del cliente', required: false })
    @IsOptional()
    @IsString()
    client_address?: string;

    @ApiProperty({ description: 'Subtotal', example: 1000.00 })
    @IsNumber()
    @Type(() => Number)
    subtotal: number;

    @ApiProperty({ description: 'Monto de IVA (si aplica)', required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    tax_amount?: number;

    @ApiProperty({ description: 'Total', example: 1160.00 })
    @IsNumber()
    @Type(() => Number)
    total: number;

    @ApiProperty({ description: 'Usuario que expidió la nota', example: 'admin' })
    @IsString()
    @IsNotEmpty()
    issued_by: string;

    @ApiProperty({ description: 'Lista de productos o servicios', type: [CreateSaleNoteItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleNoteItemDto)
    items: CreateSaleNoteItemDto[];
}
