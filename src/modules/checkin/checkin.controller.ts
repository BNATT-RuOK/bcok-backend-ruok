import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateScheduledTimeDto } from './dto/update-scheduled-time.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Req() req: any, @Body() createCheckinDto: CreateCheckinDto) {
    const userId = req.user.userId;
    return await this.checkinService.create(userId, createCheckinDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return await this.checkinService.findAll(userId);
  }

  // API khi User (SV) xac nhan an toan tren app (FE)
  @Patch('/safe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async markAsSafe(@Req() req: any) {
    const userId = req.user.userId;
    return await this.checkinService.markAsSafe(userId);
  }

  @Patch('/scheduled-time')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateScheduledTime(@Req() req: any, @Body() dto: UpdateScheduledTimeDto,) {
    const userId = req.user.userId;
    return await this.checkinService.updateScheduledTime(userId, dto);
  }
}