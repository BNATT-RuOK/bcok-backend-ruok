import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Tran Thi Bich', description: 'Updated full name' })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional({ example: '0912345678', description: 'Updated phone number' })
  @IsString()
  @IsOptional()
  @Matches(/^(\+84|0)[3-9]\d{8}$/, { message: 'phone_number must be a valid Vietnamese phone number' })
  phone_number?: string;

  @ApiPropertyOptional({ example: "08:00 PM", description: 'Check-in interval (String HH:MM AM/PM)' })
  @IsString()
  @IsOptional()
  checkin_interval_mins?: string;

  @ApiPropertyOptional({ example: 10, description: 'SOS timeout (minutes)' })
  @IsInt()
  @Min(1)
  @IsOptional()
  sos_timeout_mins?: number;
}
