import { IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateEmergencyDto {
  @IsNumber({}, { message: 'Vĩ độ phải là số' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Kinh độ phải là số' })
  @IsOptional()
  longitude?: number;

  @IsUrl({}, { message: 'Photo URL không hợp lệ' })
  @IsOptional()
  photoUrl?: string;

  @IsUrl({}, { message: 'Audio URL không hợp lệ' })
  @IsOptional()
  audioUrl?: string;
}