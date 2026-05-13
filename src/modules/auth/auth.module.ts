import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../../prisma.service';
import { ContactService } from '../contact/contact.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret_for_dev_only',
      signOptions: { 
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, ContactService],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
