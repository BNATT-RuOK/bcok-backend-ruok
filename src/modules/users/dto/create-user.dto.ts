import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van An', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'van.an@example.com', description: 'Unique email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '0901234567', description: 'Vietnamese phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+84|0)[3-9]\d{8}$/, { message: 'phone must be a valid Vietnamese phone number' })
  phone_number: string;
}
