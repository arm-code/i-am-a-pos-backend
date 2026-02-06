import { Controller, Post, Body, Get, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Post('demo-guest')
    @ApiOperation({ summary: 'One-click login for demo guest' })
    guestLogin() {
        return this.authService.guestLogin();
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Req() req: any) {
        return req.user;
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update current user profile' })
    updateProfile(@Req() req: any, @Body() updateData: Partial<User>) {
        return this.authService.updateProfile(req.user.id, updateData);
    }

    @Patch('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Change current user password' })
    changePassword(
        @Req() req: any,
        @Body('oldPassword') oldPass: string,
        @Body('newPassword') newPass: string,
    ) {
        return this.authService.changePassword(req.user.id, oldPass, newPass);
    }
}
