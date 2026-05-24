import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

enum MediaType {
  PHOTO = 'photo',
  AUDIO = 'audio',
}

@ApiTags('Emergency')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post('sos')
  @ApiOperation({ summary: 'Trigger an authenticated emergency SOS alert' })
  async triggerSos(
    @Body() createEmergencyDto: CreateEmergencyDto,
    @Req() req: any,
  ) {
    return this.emergencyService.triggerSos({
      ...createEmergencyDto,
      userId: req.user.userId,
    });
  }

  @Get('upload-url')
  @ApiOperation({ summary: 'Generate a short-lived SAS URL for SOS media upload' })
  @ApiQuery({ name: 'type', enum: MediaType })
  async getUploadUrl(
    @Query('type', new ParseEnumPipe(MediaType)) type: MediaType,
    @Req() req: any,
  ) {
    return this.emergencyService.generateUploadUrl(
      type as 'photo' | 'audio',
      req.user.userId,
    );
  }
}