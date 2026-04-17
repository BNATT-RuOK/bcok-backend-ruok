import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
} from 'class-validator';

export enum EmergencyStatus {
  SOS = 'SOS',
  RESOLVED = 'RESOLVED',
}

export class CreateEmergencyDto {
  @ApiProperty({ example: 1, description: 'ID of the user triggering SOS' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '10.7769,106.7009',
    description: 'GPS coordinates or address string',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    enum: EmergencyStatus,
    example: EmergencyStatus.SOS,
    description: '"SOS" when alert is active, "RESOLVED" when handled',
  })
  @IsEnum(EmergencyStatus)
  status: EmergencyStatus;

  @ApiProperty({
    example: '2025-04-17T08:00:00.000Z',
    description: 'ISO 8601 timestamp of the alert',
  })
  @IsDateString()
  timestamp: string;
}
