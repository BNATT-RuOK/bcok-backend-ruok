import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'van.an@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Password' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
