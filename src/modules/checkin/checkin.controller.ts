import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) { }

  @Post()
  async create(@Body() createCheckinDto: CreateCheckinDto) {
    return await this.checkinService.create(createCheckinDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return await this.checkinService.findAll(userId);
  }

  // API khi User (SV) xac nhan an toan tren app (FE)
  @Patch(':id/safe')
  async markAsSafe(@Param('id') id: string) {
    return await this.checkinService.markAsSafe(+id);
  }
}