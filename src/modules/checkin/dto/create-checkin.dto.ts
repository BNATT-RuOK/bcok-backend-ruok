import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export enum CheckinStatus {
  SAFE = 'SAFE',
  IN_TRANSIT = 'IN_TRANSIT',
}

export class CreateCheckinDto {
  @ApiProperty({ example: 1, description: 'ID of the user checking in' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'Vincom Center, Bến Nghé, Quận 1, TP.HCM',
    description: 'Location description or GPS coordinates',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    enum: CheckinStatus,
    example: CheckinStatus.SAFE,
    description: '"SAFE" when arrived, "IN_TRANSIT" when still moving',
  })
  @IsEnum(CheckinStatus)
  status: CheckinStatus;

  @ApiProperty({
    example: '2025-04-17T10:00:00.000Z',
    description: 'ISO 8601 timestamp of the check-in',
  })
  @IsDateString()
  timestamp: string;
}
