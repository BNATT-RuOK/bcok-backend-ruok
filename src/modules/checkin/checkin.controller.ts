import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';

@ApiTags('Check-in')
@Controller('checkins')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  // ── GET /checkins ──────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'Get all check-ins',
    description: 'Returns all location check-in records sorted by most recent.',
  })
  @ApiResponse({ status: 200, description: 'List of check-in records.' })
  findAll() {
    return this.checkinService.findAll();
  }

  // ── POST /checkins ─────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new check-in',
    description: 'User reports their current location and safety status.',
  })
  @ApiBody({ type: CreateCheckinDto })
  @ApiResponse({ status: 201, description: 'Check-in recorded successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  create(@Body() dto: CreateCheckinDto) {
    return this.checkinService.create(dto);
  }
}
