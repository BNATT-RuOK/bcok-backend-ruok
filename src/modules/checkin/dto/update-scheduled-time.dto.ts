import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateScheduledTimeDto {
  @ApiProperty({ example: '2026-05-28T12:00:00Z', description: 'Thời gian hẹn check-in dự kiến mới (định dạng ISO 8601)' })
  @IsDateString({}, { message: 'Thời gian dự kiến phải đúng chuẩn ISO 8601' })
  @IsNotEmpty({ message: 'Không được bỏ trống thời gian dự kiến' })
  scheduledTime: string;
}
