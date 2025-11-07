import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Nombre del metodo de pado',
    example: 'Tarjeta de credito',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripcion del metodo de pago',
    example: 'Pago con tarjeta de credito Visa/Mastercard',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Indica si el metodo está activo o inactivo',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
