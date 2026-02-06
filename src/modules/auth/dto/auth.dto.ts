import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'juan.perez@example.com',
        description: 'Correo electrónico único del usuario',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'P@ssword123',
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'Juan',
        description: 'Nombre del usuario',
    })
    @IsString()
    @MinLength(2)
    firstName: string;

    @ApiProperty({
        example: 'Pérez',
        description: 'Apellido del usuario',
    })
    @IsString()
    @MinLength(2)
    lastName: string;

    @ApiProperty({
        example: '5551234567',
        description: 'Teléfono de contacto (opcional)',
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        example: 'Av. Siempre Viva 123, Ciudad de México',
        description: 'Dirección física (opcional)',
        required: false,
    })
    @IsOptional()
    @IsString()
    address?: string;
}

export class LoginUserDto {
    @ApiProperty({
        example: 'juan.perez@example.com',
        description: 'Correo electrónico registrado',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'P@ssword123',
        description: 'Contraseña de la cuenta',
    })
    @IsString()
    password: string;
}
