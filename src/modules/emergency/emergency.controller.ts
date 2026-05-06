import { Controller, Post, Body } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';

@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post('sos')
  async triggerSos(@Body() createEmergencyDto: CreateEmergencyDto) {
    return await this.emergencyService.triggerSos(createEmergencyDto);
  }
}