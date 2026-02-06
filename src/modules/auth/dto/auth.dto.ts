import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(2)
    firstName: string;

    @IsString()
    @MinLength(2)
    lastName: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;
}

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
