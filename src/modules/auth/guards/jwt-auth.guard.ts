import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Xử lý lỗi tùy chỉnh nếu token không hợp lệ hoặc hết hạn
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required to access this resource');
    }
    return user;
  }
}
