import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmergencyDto {
  @IsInt({ message: 'User ID không hợp lệ' })
  @IsNotEmpty()
  userId: number;

  @IsNumber({}, { message: 'Vĩ độ phải là số' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Kinh độ phải là số' })
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  photoUrl?: string;
}