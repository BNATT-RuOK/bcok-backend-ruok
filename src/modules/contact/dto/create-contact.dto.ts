import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: '0987654321', description: 'Phone number of the contact' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+84|0)[3-9]\d{8}$/, { message: 'phone must be a valid Vietnamese phone number' })
  contact_phone: string;

  @ApiPropertyOptional({ example: 'contact@example.com', description: 'Email of the contact' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: 'Nguyen Van A', description: 'Name of the contact' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contact_name?: string;

  @ApiPropertyOptional({ example: 'Father', description: 'Relationship with the user' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  relationship?: string;

  @ApiPropertyOptional({ example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]', description: 'Expo push token for notifications' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  expo_push_token?: string;
}
