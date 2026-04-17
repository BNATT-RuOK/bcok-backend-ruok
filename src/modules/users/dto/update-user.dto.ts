import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Tran Thi Bich', description: 'Updated full name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '0912345678', description: 'Updated phone number' })
  @IsString()
  @IsOptional()
  @Matches(/^(\+84|0)[3-9]\d{8}$/, { message: 'phone must be a valid Vietnamese phone number' })
  phone?: string;
}
