import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ContactService } from '../contact/contact.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private contactService: ContactService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Kiểm tra email tồn tại
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    // 2. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // 3. Tạo user mới với password_hash
    const user = await this.prisma.uSER.create({
      data: {
        email: dto.email,
        password_hash: hashedPassword,
        full_name: dto.full_name,
      },
    });

    const contact = this.contactService.create(user.user_id, {contact_phone: dto.phone_number});

    // 4. Tạo token cho user mới
    const payload = { email: user.email, sub: user.user_id };
    return {
      message: 'Registration successful',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
      }
    };
  }

  async login(dto: LoginDto) {
    // 1. Tìm user
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Tạo JWT token
    const payload = { email: user.email, sub: user.user_id };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
      }
    };
  }
}
