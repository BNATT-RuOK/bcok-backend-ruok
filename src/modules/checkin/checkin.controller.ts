import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  async create(@Body() createCheckinDto: CreateCheckinDto) {
    return await this.checkinService.create(createCheckinDto);
  }

  @Get()
  async findAll() {
    return await this.checkinService.findAll();
  }

  // API khi User (SV) xac nhan an toan tren app (FE)
  @Patch(':id/safe')
  async markAsSafe(@Param('id') id: string) {
    return await this.checkinService.markAsSafe(+id);
  }
}