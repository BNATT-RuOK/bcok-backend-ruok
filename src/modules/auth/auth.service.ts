import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(dto: CreateUserDto) {

    const user = await this.usersService.create(dto);

    //Tạo token cho user mới
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
