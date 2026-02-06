import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;
            const user = this.userRepository.create({
                ...userData,
                password, // The @BeforeInsert decorator will hash this
            });
            await this.userRepository.save(user);
            delete (user as any).password;
            return user;
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('Email already exists');
            }
            throw error;
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'role', 'isActive', 'firstName', 'lastName'],
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token: this.jwtService.sign({ id: user.id, role: user.role }),
        };
    }

    async guestLogin() {
        // Look for a guest user or create one if it doesn't exist
        let guest = await this.userRepository.findOne({ where: { role: UserRole.GUEST } });

        if (!guest) {
            guest = this.userRepository.create({
                email: 'guest@business-toolbox.demo',
                password: 'guest-password-demo',
                firstName: 'Usuario',
                lastName: 'Invitado',
                role: UserRole.GUEST,
            });
            await this.userRepository.save(guest);
        }

        return {
            user: {
                id: guest.id,
                email: guest.email,
                role: guest.role,
                firstName: guest.firstName,
                lastName: guest.lastName,
            },
            token: this.jwtService.sign({ id: guest.id, role: guest.role }),
            isGuest: true,
        };
    }

    async updateProfile(id: string, updateData: Partial<User>) {
        const user = await this.findOne(id);

        // Remove sensitive fields if they came in updateData
        delete (updateData as any).password;
        delete (updateData as any).role;
        delete (updateData as any).email;

        Object.assign(user, updateData);
        return await this.userRepository.save(user);
    }

    async changePassword(id: string, oldPass: string, newPass: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'password'],
        });

        if (!user) throw new UnauthorizedException('User not found');

        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch) throw new BadRequestException('Incorrect old password');

        user.password = newPass; // @BeforeUpdate will hash this
        await this.userRepository.save(user);
        return { success: true };
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new UnauthorizedException('User not found');
        return user;
    }
}
