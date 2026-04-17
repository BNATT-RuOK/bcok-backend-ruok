import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check', description: 'Returns server uptime and status' })
  @ApiResponse({ status: 200, description: 'Server is healthy' })
  getHealth() {
    return this.appService.getHealth();
  }
}
