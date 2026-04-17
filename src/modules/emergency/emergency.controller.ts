import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';

@ApiTags('Emergency')
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  // ── GET /emergency ─────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'Get all emergency alerts',
    description: 'Returns all SOS and resolved emergency records.',
  })
  @ApiResponse({ status: 200, description: 'List of emergency alerts.' })
  findAll() {
    return this.emergencyService.findAll();
  }

  // ── GET /emergency/:id ─────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get emergency alert by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Emergency alert found.' })
  @ApiResponse({ status: 404, description: 'Emergency alert not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emergencyService.findOne(id);
  }

  // ── POST /emergency ────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new SOS alert',
    description: 'Triggers a new emergency (SOS) event for the given user and location.',
  })
  @ApiBody({ type: CreateEmergencyDto })
  @ApiResponse({ status: 201, description: 'Emergency alert created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  create(@Body() dto: CreateEmergencyDto) {
    return this.emergencyService.create(dto);
  }

  // ── DELETE /emergency/:id ──────────────────────────────────────────────────
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an emergency alert record' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Emergency alert deleted.' })
  @ApiResponse({ status: 404, description: 'Emergency alert not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.emergencyService.remove(id);
  }
}
