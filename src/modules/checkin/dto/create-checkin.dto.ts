import { IsInt, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

// Định nghĩa Enum cho status khớp với DB (Có thể mở rộng thêm)
export enum CheckinStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  SAFE = 'SAFE',
  MISSED = 'MISSED',
}

export class CreateCheckinDto {
  @IsInt({ message: 'User ID phải là một số nguyên' })
  @IsNotEmpty({ message: 'Không được bỏ trống User ID' })
  userId: number; // FE gui len camelCase

  @IsDateString({}, { message: 'Thời gian dự kiến phải đúng chuẩn ISO 8601' })
  @IsOptional()
  scheduledTime?: string; // FE gui len camelCase

  @IsEnum(CheckinStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: CheckinStatus;
}