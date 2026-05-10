import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'van.an@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Password (at least 6 characters)' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ example: 'Nguyen Van An', description: 'Full name' })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional({ example: '0901234567', description: 'Vietnamese phone number' })
  @IsString()
  @IsOptional()
  @Matches(/^(\+84|0)[3-9]\d{8}$/, { message: 'Invalid Vietnamese phone number' })
  phone_number?: string;
}
