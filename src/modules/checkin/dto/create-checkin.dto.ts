import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';

// Định nghĩa Enum cho status khớp với DB (Có thể mở rộng thêm)
export enum CheckinStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  SAFE = 'SAFE',
  MISSED = 'MISSED',
}

export class CreateCheckinDto {

  @ApiPropertyOptional({ example: '2022-01-01T00:00:00.000Z', description: 'Scheduled time' })
  @IsDateString({}, { message: 'Thời gian dự kiến phải đúng chuẩn ISO 8601' })
  @IsOptional()
  scheduledTime?: string; // FE gui len camelCase

  @ApiPropertyOptional({ enum: CheckinStatus, description: 'Status of the check-in' })
  @IsEnum(CheckinStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: CheckinStatus;
}